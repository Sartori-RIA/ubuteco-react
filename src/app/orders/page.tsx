"use client";

import Link from "next/link";
import {useEffect} from "react";
import dynamic from "next/dynamic";
import {Card, Loading, Toolbar} from "@/app/_components";
import {Pagination} from "@/app/_components/Pagination";
import {
  displayOrderAmount,
  formatOrderStatus,
  orderHasDiscount,
} from "@/app/orders/_lib/order-display";
import {OrderStatusBadge} from "@/app/orders/components";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {ordersThunks} from "@/app/_store/features/orders/ordersThunks";
import {setPage, setSearchTerm, setStatusFilter} from "@/app/_store/features/orders/ordersSlice";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {OrderStatus} from "@/app/_types";

const STATUS_FILTERS: {value: OrderStatus | ""; key: "filterAll" | "open" | "closed" | "payed"}[] = [
  {value: "", key: "filterAll"},
  {value: "open", key: "open"},
  {value: "closed", key: "closed"},
  {value: "payed", key: "payed"},
];

function Page() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const {locale} = useOrganizationSettings();
  const {formatDate} = useMoneyFormat();
  const {orders, loading, searchTerm, statusFilter, page, meta} = useAppSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        ordersThunks.fetchAll({
          search: searchTerm,
          status: statusFilter,
          page: 1,
          append: false,
        })
      );
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter, dispatch]);

  const loadMore = () => {
    const nextPage = page + 1;
    dispatch(setPage(nextPage));
    dispatch(
      ordersThunks.fetchAll({
        search: searchTerm,
        status: statusFilter,
        page: nextPage,
        append: true,
      })
    );
  };

  const pillClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm font-medium transition ${
      active
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-border bg-surface text-foreground hover:bg-surface-muted"
    }`;

  return (
    <div className="space-y-6">
      <Toolbar
        title={t("orders.title")}
        newUrl="/orders/new"
        searchValue={searchTerm}
        onSearch={(e) => dispatch(setSearchTerm(e.target.value))}
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value || "all"}
            type="button"
            onClick={() => dispatch(setStatusFilter(filter.value))}
            className={pillClass(statusFilter === filter.value)}
          >
            {filter.key === "filterAll"
              ? t("orders.filterAll")
              : formatOrderStatus(filter.key, locale)}
          </button>
        ))}
      </div>

      {loading && orders.length === 0 && <Loading/>}

      {!loading || orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card
                title={t("orders.cardTitle", {id: order.id ?? ""})}
                className="h-full hover:shadow-md"
              >
                <div className="space-y-2 text-sm text-muted">
                  <div className="flex items-center justify-between gap-2">
                    <OrderStatusBadge status={order.status}/>
                    <span className="text-foreground">{formatDate(order.created_at)}</span>
                  </div>
                  <p>
                    <strong className="text-foreground">{t("orders.table")}:</strong> {order.table?.name ?? "—"}
                  </p>
                  <p>
                    <strong className="text-foreground">{t("orders.staff")}:</strong> {order.user?.name ?? "—"}
                  </p>
                  <p>
                    <strong className="text-foreground">{t("orders.itemsCount")}:</strong>{" "}
                    {order.order_items_count ?? "—"}
                  </p>
                  <p>
                    <strong className="text-foreground">{t("orders.total")}:</strong>{" "}
                    {displayOrderAmount(order, "total_with_discount")}
                    {orderHasDiscount(order) && (
                      <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                        {t("orders.discounted")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs opacity-85">{formatOrderStatus(order.status, locale)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}

      {!loading && orders.length === 0 && (
        <p className="py-12 text-center text-sm text-muted">{t("orders.noOrders")}</p>
      )}

      <Pagination meta={meta} loading={loading} onLoadMore={loadMore}/>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {ssr: false});
