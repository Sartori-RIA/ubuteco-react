import {ApiMetaData, Order, OrderItem, OrderStatus, PaginatedResponse} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {findMatchingOrderLine} from "@/app/orders/_lib/order-items";
import {ordersThunks} from "./ordersThunks";

interface OrdersState {
  orders: Order[];
  activeOrder: Order | null;
  orderItems: OrderItem[];
  loading: boolean;
  itemsLoading: boolean;
  saving: boolean;
  addingItem: boolean;
  pendingItemIds: number[];
  /** Tracks the latest refreshOrder request; cleared when a mutation invalidates it. */
  itemsRefreshRequestId: string | null;
  errors?: string[];
  searchTerm: string;
  statusFilter: OrderStatus | "";
  page: number;
  meta: ApiMetaData;
}

const initialState: OrdersState = {
  orders: [],
  activeOrder: null,
  orderItems: [],
  loading: false,
  itemsLoading: false,
  saving: false,
  addingItem: false,
  pendingItemIds: [],
  itemsRefreshRequestId: null,
  errors: undefined,
  searchTerm: "",
  statusFilter: "",
  page: 1,
  meta: {
    count: 0,
    last: 0,
    page: 1,
    pages: 1,
    previous: null,
  },
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    clearActiveOrder(state) {
      state.activeOrder = null;
      state.orderItems = [];
      state.errors = undefined;
      state.pendingItemIds = [];
      state.itemsRefreshRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(ordersThunks.fetchAll, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        const {meta, data, append} = action.payload as PaginatedResponse<Order> & {append: boolean};
        state.meta = meta;
        state.page = meta.page;
        state.orders = append ? [...state.orders, ...data] : data;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(ordersThunks.fetchById, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.activeOrder = action.payload;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(ordersThunks.createOrder, {
      pending: (state) => {
        state.saving = true;
        state.errors = undefined;
      },
      fulfilled: (state, action) => {
        state.saving = false;
        state.activeOrder = action.payload;
        state.orderItems = [];
        state.orders.unshift(action.payload);
      },
      rejected: (state, action) => {
        state.saving = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(ordersThunks.updateOrder, {
      pending: (state) => {
        state.saving = true;
      },
      fulfilled: (state, action) => {
        state.saving = false;
        state.activeOrder = action.payload;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      },
      rejected: (state, action) => {
        state.saving = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(ordersThunks.fetchOrderItems, {
      pending: (state) => {
        state.itemsLoading = true;
      },
      fulfilled: (state, action) => {
        state.itemsLoading = false;
        state.orderItems = action.payload;
      },
      rejected: (state) => {
        state.itemsLoading = false;
      },
    });
    builder.addAsyncThunk(ordersThunks.refreshOrder, {
      pending: (state, action) => {
        state.loading = true;
        state.itemsRefreshRequestId = action.meta.requestId;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.activeOrder = action.payload.order;
        if (action.meta.requestId === state.itemsRefreshRequestId) {
          state.orderItems = action.payload.items;
          state.itemsRefreshRequestId = null;
        }
        const index = state.orders.findIndex((o) => o.id === action.payload.order.id);
        if (index !== -1) state.orders[index] = action.payload.order;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.itemsRefreshRequestId = null;
        state.errors = action.payload as string[];
      },
    });
    const syncOrderItems = (
      state: OrdersState,
      order: Order,
      items?: OrderItem[],
      itemPatch?: {item?: OrderItem; items?: OrderItem[]; removeId?: number}
    ) => {
      state.activeOrder = order;
      if (items) {
        state.orderItems = items;
      } else if (itemPatch?.item) {
        const patchId = Number(itemPatch.item.id);
        const idx = state.orderItems.findIndex((i) => Number(i.id) === patchId);
        if (idx === -1) state.orderItems.push(itemPatch.item);
        else state.orderItems[idx] = itemPatch.item;
      } else if (itemPatch?.items) {
        state.orderItems = itemPatch.items;
      } else if (itemPatch?.removeId != null) {
        state.orderItems = state.orderItems.filter((i) => i.id !== itemPatch.removeId);
      }
      const index = state.orders.findIndex((o) => o.id === order.id);
      if (index !== -1) state.orders[index] = order;
    };

    builder.addAsyncThunk(ordersThunks.addOrderItem, {
      pending: (state) => {
        state.addingItem = true;
        state.itemsRefreshRequestId = null;
        state.errors = undefined;
      },
      fulfilled: (state, action) => {
        state.addingItem = false;
        syncOrderItems(state, action.payload.order, action.payload.items);
      },
      rejected: (state, action) => {
        state.addingItem = false;
        state.errors = action.payload as string[];
      },
    });

    builder.addAsyncThunk(ordersThunks.addOrIncrementOrderItem, {
      pending: (state, action) => {
        state.addingItem = true;
        state.itemsRefreshRequestId = null;
        state.errors = undefined;
        const existing = findMatchingOrderLine(state.orderItems, action.meta.arg.data);
        if (existing?.id) {
          const itemId = Number(existing.id);
          if (!state.pendingItemIds.includes(itemId)) {
            state.pendingItemIds.push(itemId);
          }
        }
      },
      fulfilled: (state, action) => {
        state.addingItem = false;
        if (action.payload.mode === "updated") {
          state.pendingItemIds = state.pendingItemIds.filter(
            (id) => id !== Number(action.payload.item.id)
          );
          syncOrderItems(state, action.payload.order, undefined, {item: action.payload.item});
        } else {
          syncOrderItems(state, action.payload.order, action.payload.items);
        }
      },
      rejected: (state, action) => {
        state.addingItem = false;
        const existing = findMatchingOrderLine(state.orderItems, action.meta.arg.data);
        if (existing?.id) {
          const itemId = Number(existing.id);
          state.pendingItemIds = state.pendingItemIds.filter((id) => id !== itemId);
        }
        state.errors = action.payload as string[];
      },
    });

    builder.addAsyncThunk(ordersThunks.updateOrderItem, {
      pending: (state, action) => {
        state.itemsRefreshRequestId = null;
        const itemId = action.meta.arg.itemId;
        if (!state.pendingItemIds.includes(itemId)) {
          state.pendingItemIds.push(itemId);
        }
      },
      fulfilled: (state, action) => {
        state.pendingItemIds = state.pendingItemIds.filter((id) => id !== action.meta.arg.itemId);
        syncOrderItems(state, action.payload.order, undefined, {item: action.payload.item});
      },
      rejected: (state, action) => {
        state.pendingItemIds = state.pendingItemIds.filter((id) => id !== action.meta.arg.itemId);
        state.errors = action.payload as string[];
      },
    });

    builder.addAsyncThunk(ordersThunks.removeOrderItem, {
      pending: (state, action) => {
        state.itemsRefreshRequestId = null;
        const itemId = action.meta.arg.itemId;
        if (!state.pendingItemIds.includes(itemId)) {
          state.pendingItemIds.push(itemId);
        }
      },
      fulfilled: (state, action) => {
        state.pendingItemIds = state.pendingItemIds.filter((id) => id !== action.meta.arg.itemId);
        syncOrderItems(state, action.payload.order, undefined, {removeId: action.payload.itemId});
      },
      rejected: (state, action) => {
        state.pendingItemIds = state.pendingItemIds.filter((id) => id !== action.meta.arg.itemId);
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(ordersThunks.delete, {
      fulfilled: (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
        if (state.activeOrder?.id === action.payload) {
          state.activeOrder = null;
          state.orderItems = [];
        }
      },
    });
  },
});

export const {setSearchTerm, setStatusFilter, setPage, clearActiveOrder} = ordersSlice.actions;
export default ordersSlice.reducer;
