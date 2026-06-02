"use client";

import {useEffect, useRef, useState} from "react";
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
import {shouldPersistDebouncedQuantity} from "@/app/orders/_lib/quantity-input";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {useTranslations} from "@/app/_hooks/useTranslations";
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
  const serverQty = item.quantity ?? 1;
  const [localQty, setLocalQty] = useState(serverQty);
  const debouncedQty = useDebounce(localQty, 400);
  const userEditedRef = useRef(false);

  useEffect(() => {
    if (readOnly || pending || !userEditedRef.current) return;
    if (!shouldPersistDebouncedQuantity(localQty, debouncedQty, serverQty)) return;
    userEditedRef.current = false;
    onQuantityChange(Number(item.id), debouncedQty);
  }, [debouncedQty, localQty, readOnly, pending, item.id, serverQty, onQuantityChange]);

  if (readOnly) {
    return <span className="text-foreground">{item.quantity}</span>;
  }

  return (
    <input
      type="number"
      min={1}
      disabled={pending}
      className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-right text-foreground disabled:opacity-50"
      value={localQty}
      onChange={(event) => {
        userEditedRef.current = true;
        setLocalQty(Number(event.target.value));
      }}
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
  const t = useTranslations();
  const {locale} = useOrganizationSettings();

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
        {t("orders.itemsTable.empty")}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("orders.itemsTable.product")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("orders.itemsTable.type")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("orders.itemsTable.kitchen")}</th>
            <th className="px-4 py-3 text-right font-medium text-muted">{t("orders.itemsTable.unit")}</th>
            <th className="px-4 py-3 text-right font-medium text-muted">{t("orders.itemsTable.qty")}</th>
            <th className="px-4 py-3 text-right font-medium text-muted">{t("orders.itemsTable.lineTotal")}</th>
            {!readOnly && <th className="w-12 px-4 py-3"/>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {items.map((item) => {
            const pending = pendingItemIds.includes(Number(item.id));
            return (
              <tr key={item.id} className={pending ? "opacity-60" : undefined}>
                <td className="px-4 py-3 font-medium text-foreground">{orderItemProductName(item)}</td>
                <td className="px-4 py-3 text-muted">{item.item_type}</td>
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
                          {formatOrderItemStatus(status, locale)}
                        </option>
                      ))}
                    </Select>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-muted">{orderItemUnitPrice(item)}</td>
                <td className="px-4 py-3 text-right">
                  <QuantityInput
                    key={`${item.id}-${item.quantity ?? 0}`}
                    item={item}
                    readOnly={readOnly}
                    pending={pending}
                    onQuantityChange={onQuantityChange}
                  />
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">{orderItemLineTotal(item)}</td>
                {!readOnly && (
                  <td className="px-4 py-3 text-right">
                    <Buttons
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={pending}
                      onClick={() => onRemove(Number(item.id))}
                      aria-label={t("orders.itemsTable.remove")}
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
