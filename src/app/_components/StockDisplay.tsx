"use client";

import React from "react";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {DEFAULT_LOW_STOCK_THRESHOLD} from "@/app/_services/inventory";

type Props = {
  quantity: number | null | undefined;
  threshold?: number;
};

export function StockDisplay({quantity, threshold = DEFAULT_LOW_STOCK_THRESHOLD}: Props) {
  const t = useTranslations();

  if (quantity == null) {
    return null;
  }

  const low = quantity <= threshold;

  return (
    <span>
      <strong>{t("common.stock")}</strong>: {quantity}
      {low && (
        <span
          className="ml-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {t("inventory.lowStock")}
        </span>
      )}
    </span>
  );
}
