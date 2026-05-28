import {OrderStatus} from "@/app/_types";
import {formatOrderStatus} from "@/app/orders/_lib/order-display";

const STYLES: Record<OrderStatus, string> = {
  open: "bg-emerald-50 text-emerald-800 border-emerald-200",
  closed: "bg-gray-100 text-gray-700 border-gray-200",
  payed: "bg-blue-50 text-blue-800 border-blue-200",
};

export function OrderStatusBadge({status}: {status?: OrderStatus }) {
  if (!status) return null;
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {formatOrderStatus(status)}
    </span>
  );
}
