import {Dish} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Dish[]> {
  return await apiFetch<Dish[]>('/dishes');
}

async function show(id: number): Promise<Dish> {
  return await apiFetch<Dish>(`/dishes/${id}`);
}

async function create(data: Dish): Promise<Dish> {
  return await apiFetch<Dish>('/dishes', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Dish): Promise<Dish> {
  return await apiFetch<Dish>(`/dishes/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`/dishes/${id}`, {method: 'DELETE'});
}

export const dishesService = {
  update,
  create,
  index,
  show,
  destroy,
}
