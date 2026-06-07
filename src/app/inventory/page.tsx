"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {Card, Loading} from "@/app/_components";
import {StockDisplay} from "@/app/_components/StockDisplay";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {
  fetchLowStock,
  LowStockItem,
  StockableProductType,
} from "@/app/_services/inventory";
import {ApiError} from "@/app/_services/api-fetch";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";
import type {TranslationKey} from "@/app/_lib/i18n";

const PRODUCT_TYPE_LABEL: Record<StockableProductType, TranslationKey> = {
  beers: "nav.beers",
  wines: "nav.wines",
  drinks: "nav.drinks",
  foods: "nav.foods",
};

function Page() {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(5);
  const [items, setItems] = useState<LowStockItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchLowStock()
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setThreshold(data.threshold);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          const messages = resolveApiErrorMessages({errors: err.items}, t);
          setError(messages[0] ?? t("inventory.loadFailed"));
        } else {
          setError(t("inventory.loadFailed"));
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t("inventory.pageTitle")}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {t("inventory.pageSubtitle", {threshold})}
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      )}

      <Card title={t("nav.inventory")}>
        {!error && items.length === 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{t("inventory.empty")}</p>
        )}

        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-3 py-2 font-medium">{t("inventory.columnProduct")}</th>
                  <th className="px-3 py-2 font-medium">{t("inventory.columnType")}</th>
                  <th className="px-3 py-2 font-medium">{t("inventory.columnStock")}</th>
                  <th className="px-3 py-2 font-medium"/>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={`${item.product_type}-${item.id}`}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="px-3 py-3 font-medium">{item.name}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-400">
                      {t(PRODUCT_TYPE_LABEL[item.product_type])}
                    </td>
                    <td className="px-3 py-3">
                      <StockDisplay quantity={item.quantity_stock} threshold={item.threshold}/>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/${item.product_type}/${item.id}/edit`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {t("inventory.editProduct")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
