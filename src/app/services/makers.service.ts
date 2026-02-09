import {Maker} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Maker[]> {
  return await apiFetch<Maker[]>('/makers');
}

async function show(id: number): Promise<Maker> {
  return await apiFetch<Maker>(`/makers/${id}`);
}

async function create(data: Maker): Promise<Maker> {
  return await apiFetch<Maker>('/makers', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Maker): Promise<Maker> {
  return await apiFetch<Maker>(`/makers/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`/makers/${id}`, {method: 'DELETE'});
}

export const makersService = {
  update,
  create,
  index,
  show,
  destroy
}
