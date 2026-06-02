"use client";

import {Order} from "@/app/_types";
import {displayOrderAmount} from "@/app/orders/_lib/order-display";
import {useTranslations} from "@/app/_hooks/useTranslations";

export function OrderSummary({order}: {order: Order}) {
  const t = useTranslations();

  return (
    <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
      <div className="rounded-xl bg-surface-muted px-4 py-3">
        <dt className="text-muted">{t("orders.summary.subtotal")}</dt>
        <dd className="text-lg font-semibold text-foreground">{displayOrderAmount(order, "total")}</dd>
      </div>
      <div className="rounded-xl bg-surface-muted px-4 py-3">
        <dt className="text-muted">{t("orders.summary.discount")}</dt>
        <dd className="text-lg font-semibold text-foreground">{displayOrderAmount(order, "discount")}</dd>
      </div>
      <div className="rounded-xl bg-blue-50 px-4 py-3 dark:bg-blue-950/30">
        <dt className="text-blue-700 dark:text-blue-300">{t("orders.summary.total")}</dt>
        <dd className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          {displayOrderAmount(order, "total_with_discount")}
        </dd>
      </div>
    </dl>
  );
}
