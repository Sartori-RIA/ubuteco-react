"use client";

import Link from "next/link";
import {KitchenTicket} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";
import {Select} from "@/app/_components/Selects";
import {formatOrderItemStatus} from "@/app/orders/_lib/order-display";
import {KITCHEN_STATUS_OPTIONS} from "@/app/kitchen/_lib/kitchen-columns";

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
  const dishName = ticket.order_item?.name ?? "Dish";

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
            Qty <span className="font-medium text-gray-800">{ticket.quantity ?? 1}</span>
          </p>
        </div>
        {showOrderLink ? (
          <Link
            href={`/orders/${ticket.order_id}`}
            className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Order #{ticket.order_id}
          </Link>
        ) : (
          <span className="shrink-0 text-xs font-medium text-gray-500">Order #{ticket.order_id}</span>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Table: <span className="font-medium">{ticket.table?.name ?? "—"}</span>
      </p>

      <div className="mt-3">
        <Select
          name={`kitchen_status_${ticket.id}`}
          value={ticket.status}
          disabled={saving || readOnly}
          onChange={(value) => onStatusChange(Number(ticket.id), value as OrderItemStatus)}
        >
          {KITCHEN_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {formatOrderItemStatus(status)}
            </option>
          ))}
        </Select>
      </div>
    </article>
  );
}
