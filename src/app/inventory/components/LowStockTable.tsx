"use client";

import Link from "next/link";
import {StockDisplay} from "@/app/_components/StockDisplay";
import type {TranslateFn} from "@/app/_lib/i18n";
import {LowStockItem, StockableProductType} from "@/app/_services/inventory";
import type {TranslationKey} from "@/app/_lib/i18n";

const PRODUCT_TYPE_LABEL: Record<StockableProductType, TranslationKey> = {
  beers: "nav.beers",
  wines: "nav.wines",
  drinks: "nav.drinks",
  foods: "nav.foods",
};

type Props = {
  items: LowStockItem[];
  threshold: number;
  t: TranslateFn;
};

export function LowStockTable({items, threshold, t}: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">{t("inventory.empty")}</p>;
  }

  return (
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
                <StockDisplay quantity={item.quantity_stock} threshold={item.threshold ?? threshold}/>
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
  );
}
