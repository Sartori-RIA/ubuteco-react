"use client";

import {ReactNode, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {useSearchParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import {useAiEnabled} from "@/app/_hooks/useAiEnabled";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {ExpiringTable} from "@/app/inventory/components/ExpiringTable";
import {LowStockTable} from "@/app/inventory/components/LowStockTable";
import {RestockSuggestionsTable} from "@/app/inventory/components/RestockSuggestionsTable";
import {
  ExpiringProductItem,
  fetchExpiring,
  fetchLowStock,
  fetchRestockSuggestions,
  LowStockItem,
  RestockSuggestion,
} from "@/app/_services/inventory";
import {ApiError} from "@/app/_services/api-fetch";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";

type Tab = "stock" | "expiry" | "restock";

function initialTab(value: string | null): Tab {
  if (value === "expiry" || value === "restock") return value;
  return "stock";
}

function Page() {
  const t = useTranslations();
  const aiEnabled = useAiEnabled();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(initialTab(searchParams.get("tab")));
  const [loading, setLoading] = useState(true);
  const [stockError, setStockError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(5);
  const [warningDays, setWarningDays] = useState(7);
  const [stockItems, setStockItems] = useState<LowStockItem[]>([]);
  const [expiryItems, setExpiryItems] = useState<ExpiringProductItem[]>([]);
  const [coverDays, setCoverDays] = useState(7);
  const [explain, setExplain] = useState(false);
  const [restockItems, setRestockItems] = useState<RestockSuggestion[]>([]);
  const [restockWindow, setRestockWindow] = useState(28);
  const [restockError, setRestockError] = useState<string | null>(null);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [restockLoading, setRestockLoading] = useState(initialTab(searchParams.get("tab")) === "restock");
  const [restockVersion, setRestockVersion] = useState(0);

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

  useEffect(() => {
    if (tab !== "restock") return undefined;
    let cancelled = false;

    fetchRestockSuggestions(coverDays, explain && aiEnabled)
      .then((data) => {
        if (cancelled) return;
        setRestockItems(data.items);
        setRestockWindow(data.window_days);
        setRestockError(null);
        setExplainError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const text = err instanceof ApiError
          ? (resolveApiErrorMessages({errors: err.items}, t)[0] ?? t("inventory.restock.explainFailed"))
          : t("inventory.loadFailed");
        if (explain) setExplainError(text);
        else setRestockError(text);
      })
      .finally(() => {
        if (!cancelled) setRestockLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, coverDays, explain, aiEnabled, restockVersion, t]);

  if (loading) return <Loading/>;

  const error = tab === "stock" ? stockError : tab === "expiry" ? expiryError : restockError;
  const subtitle = tab === "stock"
    ? t("inventory.pageSubtitle", {threshold})
    : tab === "expiry"
      ? t("inventory.expirySubtitle", {days: warningDays})
      : t("inventory.restock.subtitle", {days: coverDays, window: restockWindow});

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
        <TabButton active={tab === "restock"} onClick={() => { setRestockLoading(true); setTab("restock"); }}>
          {t("inventory.restock.tab")}
        </TabButton>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      )}

      <Card title={
        tab === "stock" ? t("inventory.tabLowStock") : tab === "expiry" ? t("inventory.tabExpiry") : t("inventory.restock.tab")
      }>
        {!error && tab === "stock" && (
          <LowStockTable items={stockItems} threshold={threshold} t={t}/>
        )}
        {!error && tab === "expiry" && (
          <ExpiringTable items={expiryItems} t={t}/>
        )}
        {tab === "restock" && restockLoading && <Loading/>}
        {!error && tab === "restock" && !restockLoading && (
          <RestockSuggestionsTable
            items={restockItems}
            coverDays={coverDays}
            onCoverDaysChange={(days) => { setRestockLoading(true); setCoverDays(days); }}
            showExplain={aiEnabled}
            explain={explain}
            onExplainChange={(next) => { setRestockLoading(true); setExplain(next); }}
            explainError={explainError}
            onAdjusted={() => { setRestockLoading(true); setRestockVersion((version) => version + 1); }}
            t={t}
          />
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
