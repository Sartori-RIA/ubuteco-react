"use client";

import {ReactNode, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {useSearchParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {ExpiringTable} from "@/app/inventory/components/ExpiringTable";
import {LowStockTable} from "@/app/inventory/components/LowStockTable";
import {
  ExpiringProductItem,
  fetchExpiring,
  fetchLowStock,
  LowStockItem,
} from "@/app/_services/inventory";
import {ApiError} from "@/app/_services/api-fetch";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";

type Tab = "stock" | "expiry";

function Page() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(searchParams.get("tab") === "expiry" ? "expiry" : "stock");
  const [loading, setLoading] = useState(true);
  const [stockError, setStockError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(5);
  const [warningDays, setWarningDays] = useState(7);
  const [stockItems, setStockItems] = useState<LowStockItem[]>([]);
  const [expiryItems, setExpiryItems] = useState<ExpiringProductItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    function message(err: unknown): string {
      if (err instanceof ApiError) {
        const messages = resolveApiErrorMessages({errors: err.items}, t);
        return messages[0] ?? t("inventory.loadFailed");
      }
      return t("inventory.loadFailed");
    }

    Promise.allSettled([fetchLowStock(), fetchExpiring()])
      .then(([stock, expiry]) => {
        if (cancelled) return;
        if (stock.status === "fulfilled") {
          setStockItems(stock.value.items);
          setThreshold(stock.value.threshold);
        } else {
          setStockError(message(stock.reason));
        }
        if (expiry.status === "fulfilled") {
          setExpiryItems(expiry.value.items);
          setWarningDays(expiry.value.warning_days);
        } else {
          setExpiryError(message(expiry.reason));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [t]);

  if (loading) return <Loading/>;

  const error = tab === "stock" ? stockError : expiryError;
  const subtitle = tab === "stock"
    ? t("inventory.pageSubtitle", {threshold})
    : t("inventory.expirySubtitle", {days: warningDays});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t("nav.inventory")}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>

      <div className="flex gap-2" role="tablist">
        <TabButton active={tab === "stock"} onClick={() => setTab("stock")}>
          {t("inventory.tabLowStock")}
        </TabButton>
        <TabButton active={tab === "expiry"} onClick={() => setTab("expiry")}>
          {t("inventory.tabExpiry")}
        </TabButton>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      )}

      <Card title={tab === "stock" ? t("inventory.tabLowStock") : t("inventory.tabExpiry")}>
        {!error && tab === "stock" && (
          <LowStockTable items={stockItems} threshold={threshold} t={t}/>
        )}
        {!error && tab === "expiry" && (
          <ExpiringTable items={expiryItems} t={t}/>
        )}
      </Card>
    </div>
  );
}

function TabButton({active, onClick, children}: {active: boolean; onClick: () => void; children: ReactNode}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
        active
          ? "bg-blue-600 text-white"
          : "bg-surface text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
