import {Beer} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Beer[]> {
  return await apiFetch<Beer[]>('v1/beers');
}

async function show(id: number): Promise<Beer> {
  return await apiFetch<Beer>(`v1/beers/${id}`);
}

async function create(data: Beer | FormData): Promise<Beer> {
  let requestBody: string | FormData = JSON.stringify(data)
  if (data instanceof FormData) {
    requestBody = data
  }
  return await apiFetch<Beer>('v1/beers', {
    body: requestBody,
    method: 'POST',
    cache: 'no-cache',
  });
}

async function update(id: number, data: Beer | FormData): Promise<Beer> {
  let requestBody: string | FormData = JSON.stringify(data)
  if (data instanceof FormData) {
    requestBody = data
  }
  return await apiFetch<Beer>(`v1/beers/${id}`, {
    body: requestBody,
    method: 'PATCH',
    cache: 'no-cache',
  });
}

async function destroy(id: number): Promise<void> {
  await apiFetch<void>(`v1/beers/${id}`, {method: 'DELETE'});
}

export const beersService = {
  update,
  create,
  index,
  show,
  destroy
}
