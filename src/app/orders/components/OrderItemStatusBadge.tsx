"use client";

import {OrderItemStatus} from "@/app/_types";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {formatOrderItemStatus} from "@/app/orders/_lib/order-display";

const STYLES: Record<OrderItemStatus, string> = {
  awaiting: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  cooking: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  ready: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  with_the_client: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  canceled: "bg-surface-muted text-muted border-border",
  empty_stock: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
};

export function OrderItemStatusBadge({status}: {status?: OrderItemStatus}) {
  const {locale} = useOrganizationSettings();
  if (!status) return null;
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {formatOrderItemStatus(status, locale)}
    </span>
  );
}
