"use client";

import Link from "next/link";
import {formatDate} from "@/app/_lib/format-date";
import type {TranslateFn, TranslationKey} from "@/app/_lib/i18n";
import {ExpiringProductItem, ExpiryProductType, ExpiryStatus} from "@/app/_services/inventory";

const PRODUCT_TYPE_LABEL: Record<ExpiryProductType, TranslationKey> = {
  beers: "nav.beers",
  foods: "nav.foods",
};

const STATUS_LABEL: Record<ExpiryStatus, TranslationKey> = {
  expiring: "inventory.statusExpiring",
  expired: "inventory.statusExpired",
};

const STATUS_CLASS: Record<ExpiryStatus, string> = {
  expiring: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  expired: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200",
};

type Props = {
  items: ExpiringProductItem[];
  t: TranslateFn;
};

export function ExpiringTable({items, t}: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">{t("inventory.expiryEmpty")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-3 py-2 font-medium">{t("inventory.columnProduct")}</th>
            <th className="px-3 py-2 font-medium">{t("inventory.columnType")}</th>
            <th className="px-3 py-2 font-medium">{t("inventory.columnValidUntil")}</th>
            <th className="px-3 py-2 font-medium">{t("inventory.columnDays")}</th>
            <th className="px-3 py-2 font-medium">{t("inventory.columnStatus")}</th>
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
              <td className="px-3 py-3">{formatDate(item.valid_until)}</td>
              <td className="px-3 py-3">{item.days_remaining}</td>
              <td className="px-3 py-3">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[item.status]}`}>
                  {t(STATUS_LABEL[item.status])}
                </span>
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
