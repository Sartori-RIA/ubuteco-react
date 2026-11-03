"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {Card} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {fetchLowStock, lowStockCounts} from "@/app/_services/inventory";

type Counts = {runningLow: number; outOfStock: number};

export function LowStockSummaryCard() {
  const t = useTranslations();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchLowStock()
      .then((response) => {
        if (!cancelled) setCounts(lowStockCounts(response.items));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card title={t("inventory.tabLowStock")} className="hover:translate-y-0">
      {failed ? (
        <p className="text-sm text-red-700 dark:text-red-300">{t("inventory.loadFailed")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-semibold text-amber-700 dark:text-amber-300">
              {counts ? counts.runningLow.toLocaleString() : "—"}
            </p>
            <p className="mt-1 text-sm text-muted">{t("inventory.statusRunningLow")}</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-red-700 dark:text-red-300">
              {counts ? counts.outOfStock.toLocaleString() : "—"}
            </p>
            <p className="mt-1 text-sm text-muted">{t("inventory.statusOutOfStock")}</p>
          </div>
        </div>
      )}
      <Link
        href="/inventory"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        {t("inventory.viewLowStock")}
      </Link>
    </Card>
  );
}
