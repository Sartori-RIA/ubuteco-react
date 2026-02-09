import {Beer} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Beer[]> {
  return await apiFetch<Beer[]>('/beers');
}

async function show(id: number): Promise<Beer> {
  return await apiFetch<Beer>(`/beers/${id}`);
}

async function create(data: Beer): Promise<Beer> {
  return await apiFetch<Beer>('/beers', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Beer): Promise<Beer> {
  return await apiFetch<Beer>(`/beers/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  await apiFetch<void>(`/beers/${id}`, {method: 'DELETE'});
}

export const beersService = {
  update,
  create,
  index,
  show,
  destroy
}
