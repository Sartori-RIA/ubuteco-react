import {createAsyncThunk} from "@reduxjs/toolkit";
import {ItemOrderSend, Order, OrderItemStatus, OrderStatus} from "@/app/_types";
import {ApiError, apiFetchPaginated} from "@/app/_services/api-fetch";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";
import {
  CreateOrderPayload,
  ordersService,
  UpdateOrderPayload,
} from "@/app/_services/orders.service";

const crud = createCrudThunks<Order>("orders", {paginated: true});

export type FetchOrdersParams = {
  search?: string;
  page?: number;
  status?: OrderStatus | "";
  append?: boolean;
};

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
      const order = await ordersService.show(orderId);
      return {item, order};
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
  updateOrderItem,
  removeOrderItem,
  refreshOrder,
};
