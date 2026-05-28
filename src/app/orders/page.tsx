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
import {formatDate} from "@/app/_lib/format-date";
import {OrderStatus} from "@/app/_types";

const STATUS_FILTERS: {value: OrderStatus | ""; label: string}[] = [
  {value: "", label: "All"},
  {value: "open", label: "Open"},
  {value: "closed", label: "Closed"},
  {value: "payed", label: "Paid"},
];

function Page() {
  const dispatch = useAppDispatch();
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

  return (
    <div className="space-y-6">
      <Toolbar
        title="Orders"
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
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              statusFilter === filter.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && orders.length === 0 && <Loading/>}

      {!loading || orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card title={`Order #${order.id}`} className="h-full hover:shadow-md">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between gap-2">
                    <OrderStatusBadge status={order.status}/>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <p>
                    <strong>Table:</strong> {order.table?.name ?? "—"}
                  </p>
                  <p>
                    <strong>Staff:</strong> {order.user?.name ?? "—"}
                  </p>
                  <p>
                    <strong>Items:</strong> {order.order_items_count ?? "—"}
                  </p>
                  <p>
                    <strong>Total:</strong> {displayOrderAmount(order, "total_with_discount")}
                    {orderHasDiscount(order) && (
                      <span className="ml-1 text-xs text-amber-600">(discounted)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{formatOrderStatus(order.status)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}

      {!loading && orders.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-12">No orders found.</p>
      )}

      <Pagination meta={meta} loading={loading} onLoadMore={loadMore}/>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {ssr: false});
