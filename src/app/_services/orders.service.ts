import {ItemOrderSend, Order, OrderItem, OrderItemStatus} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

export type CreateOrderPayload = {
  table_id?: number | null;
  discount?: number;
};

export type UpdateOrderPayload = {
  table_id?: number | null;
  discount?: number;
  status?: "open" | "closed" | "payed";
};

async function show(id: number): Promise<Order> {
  return await apiFetch<Order>(`v1/orders/${id}`);
}

async function create(data: CreateOrderPayload): Promise<Order> {
  return await apiFetch<Order>("v1/orders", {
    body: JSON.stringify(data),
    method: "POST",
  });
}

async function update(id: number, data: UpdateOrderPayload): Promise<Order> {
  return await apiFetch<Order>(`v1/orders/${id}`, {
    body: JSON.stringify(data),
    method: "PUT",
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/orders/${id}`, {method: "DELETE"});
}

async function listItems(orderId: number): Promise<OrderItem[]> {
  return await apiFetch<OrderItem[]>(`v1/orders/${orderId}/items`);
}

async function addItem(orderId: number, data: ItemOrderSend): Promise<OrderItem> {
  return await apiFetch<OrderItem>(`v1/orders/${orderId}/items`, {
    body: JSON.stringify(data),
    method: "POST",
  });
}

async function updateItem(
  orderId: number,
  itemId: number,
  data: {quantity?: number; status?: OrderItemStatus}
): Promise<OrderItem> {
  return await apiFetch<OrderItem>(`v1/orders/${orderId}/items/${itemId}`, {
    body: JSON.stringify(data),
    method: "PUT",
  });
}

async function deleteItem(orderId: number, itemId: number): Promise<void> {
  return await apiFetch<void>(`v1/orders/${orderId}/items/${itemId}`, {method: "DELETE"});
}

export const ordersService = {
  show,
  create,
  update,
  destroy,
  listItems,
  addItem,
  updateItem,
  deleteItem,
};
