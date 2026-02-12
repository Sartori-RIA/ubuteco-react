import {Order} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Order[]> {
  return await apiFetch<Order[]>('v1/orders');
}

async function show(id: number): Promise<Order> {
  return await apiFetch<Order>(`v1/orders/${id}`);
}

async function create(data: Order): Promise<Order> {
  return await apiFetch<Order>('v1/orders', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Order): Promise<Order> {
  return await apiFetch<Order>(`v1/orders/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  await apiFetch<void>(`v1/orders/${id}`, {method: 'DELETE'});
}

export const ordersService = {
  update,
  create,
  index,
  show,
  destroy,
}
