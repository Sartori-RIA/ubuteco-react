"use client";

import {OrderStatus} from "@/app/_types";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {formatOrderStatus} from "@/app/orders/_lib/order-display";

const STYLES: Record<OrderStatus, string> = {
  open: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  closed: "bg-surface-muted text-muted border-border",
  payed: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
};

export function OrderStatusBadge({status}: {status?: OrderStatus}) {
  const {locale} = useOrganizationSettings();
  if (!status) return null;
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {formatOrderStatus(status, locale)}
    </span>
  );
}
