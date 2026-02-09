import {Order} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Order[]> {
  return await apiFetch<Order[]>('/orders');
}

async function show(id: number): Promise<Order> {
  return await apiFetch<Order>(`/orders/${id}`);
}

async function create(data: Order): Promise<Order> {
  return await apiFetch<Order>('/orders', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Order): Promise<Order> {
  return await apiFetch<Order>(`/orders/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  await apiFetch<void>(`/orders/${id}`, {method: 'DELETE'});
}

export const ordersService = {
  update,
  create,
  index,
  show,
  destroy,
}
