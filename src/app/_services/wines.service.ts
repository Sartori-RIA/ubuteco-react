import {Wine} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

async function index(): Promise<Wine[]> {
  return await apiFetch<Wine[]>('v1/wines');
}

async function show(id: number): Promise<Wine> {
  return await apiFetch<Wine>(`v1/wines/${id}`);
}

async function create(data: Wine): Promise<Wine> {
  return await apiFetch<Wine>('v1/wines', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Wine): Promise<Wine> {
  return await apiFetch<Wine>(`v1/wines/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/wines/${id}`, {method: 'DELETE'});
}

export const winesService = {
  update,
  create,
  index,
  show,
  destroy
}
