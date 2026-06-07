"use client";

import Link from "next/link";
import {KitchenTicket} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";
import {Select} from "@/app/_components/Selects";
import {formatOrderItemStatus} from "@/app/orders/_lib/order-display";
import {selectableOrderItemStatuses} from "@/app/orders/_lib/order-item-transitions";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  ticket: KitchenTicket;
  saving?: boolean;
  showOrderLink?: boolean;
  readOnly?: boolean;
  onStatusChange: (id: number, status: OrderItemStatus) => void;
};

export function KitchenTicketCard({
  ticket,
  saving = false,
  showOrderLink = true,
  readOnly = false,
  onStatusChange,
}: Props) {
  const t = useTranslations();
  const {locale} = useOrganizationSettings();
  const dishName = ticket.order_item?.name ?? t("kitchen.defaultDishName");
  const statusOptions = selectableOrderItemStatuses(ticket.status ?? "awaiting", true);

  return (
    <article
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition ${
        saving ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{dishName}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("kitchen.ticketQty", {count: ticket.quantity ?? 1})}
          </p>
        </div>
        {showOrderLink ? (
          <Link
            href={`/orders/${ticket.order_id}`}
            className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {t("kitchen.ticketOrder", {id: ticket.order_id ?? 0})}
          </Link>
        ) : (
          <span className="shrink-0 text-xs font-medium text-gray-500">
            {t("kitchen.ticketOrder", {id: ticket.order_id ?? 0})}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {t("kitchen.ticketTable")}{" "}
        <span className="font-medium">{ticket.table?.name ?? "—"}</span>
      </p>

      <div className="mt-3">
        <Select
          name={`kitchen_status_${ticket.id}`}
          value={ticket.status}
          disabled={saving || readOnly}
          onChange={(value) => onStatusChange(Number(ticket.id), value as OrderItemStatus)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {formatOrderItemStatus(status, locale)}
            </option>
          ))}
        </Select>
      </div>
    </article>
  );
}
