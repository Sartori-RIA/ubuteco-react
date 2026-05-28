import {Order} from "@/app/_types";
import {displayOrderAmount} from "@/app/orders/_lib/order-display";

export function OrderSummary({order}: {order: Order}) {
  return (
    <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
      <div className="rounded-xl bg-gray-50 px-4 py-3">
        <dt className="text-gray-500">Subtotal</dt>
        <dd className="text-lg font-semibold text-gray-900">{displayOrderAmount(order, "total")}</dd>
      </div>
      <div className="rounded-xl bg-gray-50 px-4 py-3">
        <dt className="text-gray-500">Discount</dt>
        <dd className="text-lg font-semibold text-gray-900">{displayOrderAmount(order, "discount")}</dd>
      </div>
      <div className="rounded-xl bg-blue-50 px-4 py-3">
        <dt className="text-blue-700">Total</dt>
        <dd className="text-lg font-semibold text-blue-900">{displayOrderAmount(order, "total_with_discount")}</dd>
      </div>
    </dl>
  );
}
