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
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useEntityDocumentTitle} from "@/app/_hooks/useDocumentTitle";
import {useToast} from "@/app/_components/Toast/ToastProvider";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {ordersThunks} from "@/app/_store/features/orders/ordersThunks";
import {clearActiveOrder} from "@/app/_store/features/orders/ordersSlice";
import {tablesThunks} from "@/app/_store/features/tables/tablesThunks";
import {ItemOrderSend, OrderItemStatus} from "@/app/_types";

export default function OrderPage() {
  const {id} = useParams<{id: string}>();
  const orderId = Number(id);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const {confirm, confirmDialogProps} = useConfirm();
  const {canMutateOperationalData} = useAuthCapabilities();
  const t = useTranslations();
  const {formatDate} = useMoneyFormat();

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

  useEntityDocumentTitle(
    activeOrder ? t("orders.orderNumber", {id: String(activeOrder.id)}) : undefined
  );

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
    const result = await dispatch(ordersThunks.addOrIncrementOrderItem({orderId, data: payload}));

    if (ordersThunks.addOrIncrementOrderItem.fulfilled.match(result)) {
      showToast(
        t(result.payload.mode === "updated" ? "orders.toast.itemQtyUpdated" : "orders.toast.itemAdded"),
        "success"
      );
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
      title: t("orders.confirm.removeItem.title"),
      message: t("orders.confirm.removeItem.message"),
      confirmLabel: t("orders.confirm.removeItem.confirm"),
      variant: "danger",
    });
    if (!ok) return;

    const result = await dispatch(ordersThunks.removeOrderItem({orderId, itemId}));
    if (ordersThunks.removeOrderItem.fulfilled.match(result)) {
      showToast(t("orders.toast.itemRemoved"), "success");
    }
  };

  const handleCloseOrder = async () => {
    if (!activeOrder) return;
    const ok = await confirm({
      title: t("orders.confirm.close.title"),
      message: t("orders.confirm.close.message"),
      confirmLabel: t("orders.confirm.close.confirm"),
    });
    if (!ok) return;

    const result = await dispatch(
      ordersThunks.updateOrder({id: Number(activeOrder.id), data: {status: "closed"}})
    );
    if (ordersThunks.updateOrder.fulfilled.match(result)) {
      showToast(t("orders.toast.orderClosed"), "success");
    }
  };

  const handleMarkPaid = async () => {
    if (!activeOrder) return;
    const ok = await confirm({
      title: t("orders.confirm.markPaid.title"),
      message: t("orders.confirm.markPaid.message"),
      confirmLabel: t("orders.confirm.markPaid.confirm"),
    });
    if (!ok) return;

    const result = await dispatch(
      ordersThunks.updateOrder({id: Number(activeOrder.id), data: {status: "payed"}})
    );
    if (ordersThunks.updateOrder.fulfilled.match(result)) {
      showToast(t("orders.toast.orderPaid"), "success");
    }
  };

  const handleDeleteOrder = async () => {
    if (!activeOrder) return;
    const ok = await confirm({
      title: t("orders.confirm.delete.title"),
      message: t("orders.confirm.delete.message"),
      confirmLabel: t("orders.confirm.delete.confirm"),
      variant: "danger",
    });
    if (!ok) return;

    const result = await dispatch(ordersThunks.delete(Number(activeOrder.id)));
    if (ordersThunks.delete.fulfilled.match(result)) {
      showToast(t("orders.toast.orderDeleted"), "success");
      router.replace("/orders");
    }
  };

  if ((loading || itemsLoading) && !activeOrder) {
    return <Loading/>;
  }

  if (!activeOrder) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">{t("orders.notFound")}</h1>
        <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
          ← {t("orders.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <ConfirmDialog {...confirmDialogProps} loading={saving}/>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            ← {t("orders.back")}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {t("orders.orderNumber", {id: activeOrder.id ?? ""})}
            </h1>
            <OrderStatusBadge status={activeOrder.status}/>
          </div>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            <div>
              <dt className="inline font-medium">{t("orders.created")}: </dt>
              <dd className="inline text-foreground">{formatDate(activeOrder.created_at)}</dd>
            </div>
            <div>
              <dt className="inline font-medium">{t("orders.table")}: </dt>
              <dd className="inline text-foreground">
                {activeOrder.table?.name ? (
                  <Link href="/tables" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    {activeOrder.table.name}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">{t("orders.staff")}: </dt>
              <dd className="inline text-foreground">{activeOrder.user?.name ?? "—"}</dd>
            </div>
          </dl>
        </div>

        {canMutateOperationalData && (
          <div className="flex flex-wrap gap-2">
            {isOpen && (
              <Buttons variant="outline" onClick={handleCloseOrder} loading={saving}>
                {t("orders.closeOrder")}
              </Buttons>
            )}
            {isClosed && (
              <Buttons variant="default" onClick={handleMarkPaid} loading={saving}>
                {t("orders.markPaid")}
              </Buttons>
            )}
            {isOpen && (
              <Buttons variant="danger" onClick={handleDeleteOrder} loading={saving}>
                {t("orders.delete")}
              </Buttons>
            )}
          </div>
        )}
      </div>

      <FormErrors errors={errors}/>

      <Card title={t("orders.tableAndDiscount")} className="hover:translate-y-0">
        <OrderMetaForm
          key={`${activeOrder.id}-${activeOrder.table_id ?? ""}-${activeOrder.discount_cents ?? 0}`}
          order={activeOrder}
          tables={tables}
          readOnly={readOnly}
          onSave={handleMetaSave}
        />
      </Card>

      <Card title={t("orders.items")} className="hover:translate-y-0">
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

      <Card title={t("orders.totals")} className="hover:translate-y-0">
        <OrderSummary order={activeOrder}/>
      </Card>
    </div>
  );
}
