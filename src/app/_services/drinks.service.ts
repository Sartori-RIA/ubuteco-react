import {Drink} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

async function index(): Promise<Drink[]> {
  return await apiFetch<Drink[]>('v1/drinks');
}

async function show(id: number): Promise<Drink> {
  return await apiFetch<Drink>(`v1/drinks/${id}`);
}

async function create(data: Drink): Promise<Drink> {
  return await apiFetch<Drink>('v1/drinks', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Drink): Promise<Drink> {
  return await apiFetch<Drink>(`v1/drinks/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/drinks/${id}`, {method: 'DELETE'});
}

export const drinksService = {
  update,
  create,
  index,
  show,
  destroy,
}
