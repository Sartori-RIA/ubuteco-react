import {createAsyncThunk} from "@reduxjs/toolkit";
import {ItemOrderSend, Order, OrderItemStatus, OrderStatus} from "@/app/_types";
import {ApiError, apiFetchPaginated} from "@/app/_services/api-fetch";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";
import {
  CreateOrderPayload,
  ordersService,
  UpdateOrderPayload,
} from "@/app/_services/orders.service";
import {RootState} from "@/app/_store";
import {findMatchingOrderLine} from "@/app/orders/_lib/order-items";
import {
  isOrdersListCacheFresh,
} from "./orders-list-cache";

const crud = createCrudThunks<Order>("orders", {paginated: true});

export type FetchOrdersParams = {
  search?: string;
  page?: number;
  status?: OrderStatus | "";
  append?: boolean;
};

export {buildOrdersListCacheKey} from "./orders-list-cache";

const fetchAll = createAsyncThunk(
  "orders/fetchAll",
  async (params: FetchOrdersParams = {}, {rejectWithValue}) => {
    try {
      const {search = "", page = 1, status = ""} = params;
      const qs = new URLSearchParams();
      if (search) qs.set("q", search);
      if (page > 1) qs.set("page", String(page));
      if (status) qs.set("status", status);
      const query = qs.toString() ? `?${qs.toString()}` : "";
      const result = await apiFetchPaginated<Order>(`v1/orders${query}`);
      return {...result, append: params.append ?? false};
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not load orders"]);
    }
  },
  {
    condition: (params = {}, {getState}) => {
      const {append = false, page = 1} = params;
      if (append || page > 1) return true;

      const orders = (getState() as RootState).orders;
      if (orders.orders.length === 0) return true;

      return !isOrdersListCacheFresh(orders.listCacheKey, orders.listFetchedAt, params);
    },
  }
);

const fetchOrderItems = createAsyncThunk(
  "orders/fetchOrderItems",
  async (orderId: number, {rejectWithValue}) => {
    try {
      return await ordersService.listItems(orderId);
    } catch (err) {
      return rejectWithValue(["Could not load order items"]);
    }
  }
);

const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (payload: CreateOrderPayload, {rejectWithValue}) => {
    try {
      return await ordersService.create(payload);
    } catch (err) {
      return rejectWithValue(["Could not create order"]);
    }
  }
);

const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({id, data}: {id: number; data: UpdateOrderPayload}, {rejectWithValue}) => {
    try {
      return await ordersService.update(id, data);
    } catch (err) {
      return rejectWithValue(["Could not update order"]);
    }
  }
);

const addOrderItem = createAsyncThunk(
  "orders/addOrderItem",
  async ({orderId, data}: {orderId: number; data: ItemOrderSend}, {rejectWithValue}) => {
    try {
      const item = await ordersService.addItem(orderId, data);
      const [order, items] = await Promise.all([
        ordersService.show(orderId),
        ordersService.listItems(orderId),
      ]);
      return {item, order, items};
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not add item"]);
    }
  }
);

const addOrIncrementOrderItem = createAsyncThunk(
  "orders/addOrIncrementOrderItem",
  async ({orderId, data}: {orderId: number; data: ItemOrderSend}, {getState, rejectWithValue}) => {
    const orderItems = (getState() as RootState).orders.orderItems;
    const existing = findMatchingOrderLine(orderItems, data);

    try {
      if (existing?.id) {
        const item = await ordersService.updateItem(orderId, Number(existing.id), {
          quantity: (existing.quantity ?? 0) + data.quantity,
        });
        const order = await ordersService.show(orderId);
        return {mode: "updated" as const, item, order};
      }

      const item = await ordersService.addItem(orderId, data);
      const [order, items] = await Promise.all([
        ordersService.show(orderId),
        ordersService.listItems(orderId),
      ]);
      return {mode: "added" as const, item, order, items};
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not add item"]);
    }
  }
);

const updateOrderItem = createAsyncThunk(
  "orders/updateOrderItem",
  async (
    {
      orderId,
      itemId,
      quantity,
      status,
    }: {orderId: number; itemId: number; quantity?: number; status?: OrderItemStatus},
    {rejectWithValue}
  ) => {
    try {
      const item = await ordersService.updateItem(orderId, itemId, {quantity, status});
      const order = await ordersService.show(orderId);
      return {item, order};
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not update item"]);
    }
  }
);

const removeOrderItem = createAsyncThunk(
  "orders/removeOrderItem",
  async ({orderId, itemId}: {orderId: number; itemId: number}, {rejectWithValue}) => {
    try {
      await ordersService.deleteItem(orderId, itemId);
      const order = await ordersService.show(orderId);
      return {itemId, order};
    } catch (err) {
      return rejectWithValue(["Could not remove item"]);
    }
  }
);

const refreshOrder = createAsyncThunk(
  "orders/refreshOrder",
  async (orderId: number, {rejectWithValue}) => {
    try {
      const [order, items] = await Promise.all([
        ordersService.show(orderId),
        ordersService.listItems(orderId),
      ]);
      return {order, items};
    } catch (err) {
      return rejectWithValue(["Could not refresh order"]);
    }
  }
);

export const ordersThunks = {
  ...crud,
  fetchAll,
  fetchOrderItems,
  createOrder,
  updateOrder,
  addOrderItem,
  addOrIncrementOrderItem,
  updateOrderItem,
  removeOrderItem,
  refreshOrder,
};
