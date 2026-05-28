"use client";

import Link from "next/link";
import {useCallback, useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {Buttons, Card, FormErrors, Loading} from "@/app/_components";
import {ConfirmDialog} from "@/app/_components/ConfirmDialog";
import {
  AddOrderItemPanel,
  OrderItemsTable,
  OrderMetaForm,
  OrderStatusBadge,
  OrderSummary,
} from "@/app/orders/components";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useConfirm} from "@/app/_hooks/useConfirm";
import {useToast} from "@/app/_components/Toast/ToastProvider";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {ordersThunks} from "@/app/_store/features/orders/ordersThunks";
import {clearActiveOrder} from "@/app/_store/features/orders/ordersSlice";
import {tablesThunks} from "@/app/_store/features/tables/tablesThunks";
import {ItemOrderSend, OrderItemStatus} from "@/app/_types";
import {formatDate} from "@/app/_lib/format-date";

export default function OrderPage() {
  const {id} = useParams<{id: string}>();
  const orderId = Number(id);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const {confirm, confirmDialogProps} = useConfirm();
  const {canMutateOperationalData} = useAuthCapabilities();

  const {
    activeOrder,
    orderItems,
    loading,
    itemsLoading,
    saving,
    addingItem,
    pendingItemIds,
    errors,
  } = useAppSelector((state: RootState) => state.orders);
  const {tables} = useAppSelector((state: RootState) => state.tables);

  const isOpen = activeOrder?.status === "open";
  const isClosed = activeOrder?.status === "closed";
  const readOnly = !canMutateOperationalData || !isOpen;

  const loadOrder = useCallback(() => {
    if (!orderId) return;
    dispatch(ordersThunks.refreshOrder(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (!orderId) return;
    dispatch(ordersThunks.refreshOrder(orderId));
    dispatch(tablesThunks.fetchAll({}));

    return () => {
      dispatch(clearActiveOrder());
    };
  }, [orderId, dispatch]);

  const handleMetaSave = useCallback(
    async (data: {table_id: number | null; discount: number}) => {
      if (!orderId || readOnly) return;
      await dispatch(ordersThunks.updateOrder({id: orderId, data}));
    },
    [orderId, readOnly, dispatch]
  );

  const handleAddItem = async (payload: ItemOrderSend) => {
    const existing = orderItems.find(
      (line) => line.item_type === payload.item_type && line.item_id === payload.item_id
    );

    if (existing?.id) {
      const result = await dispatch(
        ordersThunks.updateOrderItem({
          orderId,
          itemId: Number(existing.id),
          quantity: (existing.quantity ?? 0) + payload.quantity,
        })
      );
      if (ordersThunks.updateOrderItem.fulfilled.match(result)) {
        showToast("Item quantity updated", "success");
      }
      return;
    }

    const result = await dispatch(ordersThunks.addOrderItem({orderId, data: payload}));
    if (ordersThunks.addOrderItem.fulfilled.match(result)) {
      showToast("Item added to order", "success");
    }
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(ordersThunks.updateOrderItem({orderId, itemId, quantity}));
  };

  const handleStatusChange = (itemId: number, status: OrderItemStatus) => {
    dispatch(ordersThunks.updateOrderItem({orderId, itemId, status}));
  };

  const handleRemoveItem = async (itemId: number) => {
    const ok = await confirm({
      title: "Remove item",
      message: "Remove this item from the order? Stock will be restored for stocked products.",
      confirmLabel: "Remove",
      variant: "danger",
    });
    if (!ok) return;

    const result = await dispatch(ordersThunks.removeOrderItem({orderId, itemId}));
    if (ordersThunks.removeOrderItem.fulfilled.match(result)) {
      showToast("Item removed", "success");
    }
  };

  const handleCloseOrder = async () => {
    if (!activeOrder) return;
    const ok = await confirm({
      title: "Close order",
      message: "Close this order? You will not be able to add more items.",
      confirmLabel: "Close order",
    });
    if (!ok) return;

    const result = await dispatch(
      ordersThunks.updateOrder({id: Number(activeOrder.id), data: {status: "closed"}})
    );
    if (ordersThunks.updateOrder.fulfilled.match(result)) {
      showToast("Order closed", "success");
    }
  };

  const handleMarkPaid = async () => {
    if (!activeOrder) return;
    const ok = await confirm({
      title: "Mark as paid",
      message: "Mark this order as paid?",
      confirmLabel: "Mark paid",
    });
    if (!ok) return;

    const result = await dispatch(
      ordersThunks.updateOrder({id: Number(activeOrder.id), data: {status: "payed"}})
    );
    if (ordersThunks.updateOrder.fulfilled.match(result)) {
      showToast("Order marked as paid", "success");
    }
  };

  const handleDeleteOrder = async () => {
    if (!activeOrder) return;
    const ok = await confirm({
      title: "Delete order",
      message: "Delete this order permanently?",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!ok) return;

    const result = await dispatch(ordersThunks.delete(Number(activeOrder.id)));
    if (ordersThunks.delete.fulfilled.match(result)) {
      showToast("Order deleted", "success");
      router.replace("/orders");
    }
  };

  if ((loading || itemsLoading) && !activeOrder) {
    return <Loading/>;
  }

  if (!activeOrder) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link href="/orders" className="text-blue-600 text-sm">← Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <ConfirmDialog {...confirmDialogProps} loading={saving}/>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back to orders
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Order #{activeOrder.id}</h1>
            <OrderStatusBadge status={activeOrder.status}/>
          </div>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            <div>
              <dt className="inline font-medium text-gray-500">Created: </dt>
              <dd className="inline">{formatDate(activeOrder.created_at)}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-gray-500">Table: </dt>
              <dd className="inline">
                {activeOrder.table?.name ? (
                  <Link href="/tables" className="text-blue-600 hover:text-blue-700">
                    {activeOrder.table.name}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium text-gray-500">Staff: </dt>
              <dd className="inline">{activeOrder.user?.name ?? "—"}</dd>
            </div>
          </dl>
        </div>

        {canMutateOperationalData && (
          <div className="flex flex-wrap gap-2">
            {isOpen && (
              <Buttons variant="outline" onClick={handleCloseOrder} loading={saving}>
                Close order
              </Buttons>
            )}
            {isClosed && (
              <Buttons variant="default" onClick={handleMarkPaid} loading={saving}>
                Mark as paid
              </Buttons>
            )}
            {isOpen && (
              <Buttons variant="danger" onClick={handleDeleteOrder} loading={saving}>
                Delete
              </Buttons>
            )}
          </div>
        )}
      </div>

      <FormErrors errors={errors}/>

      <Card title="Table & discount" className="hover:translate-y-0">
        <OrderMetaForm
          key={`${activeOrder.id}-${activeOrder.table_id ?? ""}-${activeOrder.discount_cents ?? 0}`}
          order={activeOrder}
          tables={tables}
          readOnly={readOnly}
          onSave={handleMetaSave}
        />
      </Card>

      <Card title="Items" className="hover:translate-y-0">
        {!readOnly && (
          <div className="mb-6">
            <AddOrderItemPanel
              orderItems={orderItems}
              loading={addingItem}
              onAdd={handleAddItem}
            />
          </div>
        )}

        <OrderItemsTable
          items={orderItems}
          readOnly={readOnly}
          pendingItemIds={pendingItemIds}
          onQuantityChange={handleQuantityChange}
          onStatusChange={readOnly ? undefined : handleStatusChange}
          onRemove={handleRemoveItem}
        />
      </Card>

      <Card title="Totals" className="hover:translate-y-0">
        <OrderSummary order={activeOrder}/>
      </Card>
    </div>
  );
}
