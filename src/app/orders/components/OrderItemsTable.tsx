"use client";

import {useEffect, useState} from "react";
import {OrderItem, OrderItemStatus} from "@/app/_types";
import {Buttons} from "@/app/_components";
import {Select} from "@/app/_components/Selects";
import {OrderItemStatusBadge} from "@/app/orders/components/OrderItemStatusBadge";
import {
  formatOrderItemStatus,
  orderItemLineTotal,
  orderItemProductName,
  orderItemUnitPrice,
} from "@/app/orders/_lib/order-display";
import {useDebounce} from "@/app/_hooks/useDebounce";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

const ITEM_STATUSES: OrderItemStatus[] = [
  "awaiting",
  "cooking",
  "ready",
  "with_the_client",
  "canceled",
  "empty_stock",
];

type Props = {
  items: OrderItem[];
  readOnly?: boolean;
  pendingItemIds?: number[];
  onQuantityChange: (itemId: number, quantity: number) => void;
  onStatusChange?: (itemId: number, status: OrderItemStatus) => void;
  onRemove: (itemId: number) => void;
};

function QuantityInput({
  item,
  readOnly,
  pending,
  onQuantityChange,
}: {
  item: OrderItem;
  readOnly: boolean;
  pending: boolean;
  onQuantityChange: (itemId: number, quantity: number) => void;
}) {
  const [localQty, setLocalQty] = useState(item.quantity ?? 1);
  const debouncedQty = useDebounce(localQty, 400);

  useEffect(() => {
    if (readOnly || pending) return;
    const serverQty = item.quantity ?? 1;
    if (debouncedQty < 1 || debouncedQty === serverQty) return;
    onQuantityChange(Number(item.id), debouncedQty);
  }, [debouncedQty, readOnly, pending, item.id, item.quantity, onQuantityChange]);

  if (readOnly) {
    return <>{item.quantity}</>;
  }

  return (
    <input
      type="number"
      min={1}
      disabled={pending}
      className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-right disabled:opacity-50"
      value={localQty}
      onChange={(e) => setLocalQty(Number(e.target.value))}
    />
  );
}

export function OrderItemsTable({
  items,
  readOnly = false,
  pendingItemIds = [],
  onQuantityChange,
  onStatusChange,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500 rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center">
        No items yet. Use the form above to add products to this order.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Product</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Kitchen</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Unit</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Qty</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Line total</th>
            {!readOnly && <th className="px-4 py-3 w-12"/>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.map((item) => {
            const pending = pendingItemIds.includes(Number(item.id));
            return (
              <tr key={item.id} className={pending ? "opacity-60" : undefined}>
                <td className="px-4 py-3 font-medium text-gray-900">{orderItemProductName(item)}</td>
                <td className="px-4 py-3 text-gray-500">{item.item_type}</td>
                <td className="px-4 py-3">
                  {readOnly || !onStatusChange ? (
                    <OrderItemStatusBadge status={item.status}/>
                  ) : (
                    <Select
                      name={`item_status_${item.id}`}
                      value={item.status}
                      onChange={(value) => onStatusChange(Number(item.id), value as OrderItemStatus)}
                    >
                      {ITEM_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {formatOrderItemStatus(status)}
                        </option>
                      ))}
                    </Select>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{orderItemUnitPrice(item)}</td>
                <td className="px-4 py-3 text-right">
                  <QuantityInput
                    key={item.id}
                    item={item}
                    readOnly={readOnly}
                    pending={pending}
                    onQuantityChange={onQuantityChange}
                  />
                </td>
                <td className="px-4 py-3 text-right font-medium">{orderItemLineTotal(item)}</td>
                {!readOnly && (
                  <td className="px-4 py-3 text-right">
                    <Buttons
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={pending}
                      onClick={() => onRemove(Number(item.id))}
                      aria-label="Remove item"
                    >
                      <FontAwesomeIcon icon={faTrash}/>
                    </Buttons>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
