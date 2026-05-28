import {OrderItemStatus} from "@/app/_types";
import {formatOrderItemStatus} from "@/app/orders/_lib/order-display";

const STYLES: Record<OrderItemStatus, string> = {
  awaiting: "bg-amber-50 text-amber-800 border-amber-200",
  cooking: "bg-orange-50 text-orange-800 border-orange-200",
  ready: "bg-emerald-50 text-emerald-800 border-emerald-200",
  with_the_client: "bg-blue-50 text-blue-800 border-blue-200",
  canceled: "bg-gray-100 text-gray-600 border-gray-200",
  empty_stock: "bg-red-50 text-red-800 border-red-200",
};

export function OrderItemStatusBadge({status}: {status?: OrderItemStatus}) {
  if (!status) return null;
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {formatOrderItemStatus(status)}
    </span>
  );
}
