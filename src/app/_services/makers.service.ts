import {Maker} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

async function index(): Promise<Maker[]> {
  return await apiFetch<Maker[]>('v1/makers');
}

async function show(id: number): Promise<Maker> {
  return await apiFetch<Maker>(`v1/makers/${id}`);
}

async function create(data: Maker): Promise<Maker> {
  return await apiFetch<Maker>('v1/makers', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Maker): Promise<Maker> {
  return await apiFetch<Maker>(`v1/makers/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/makers/${id}`, {method: 'DELETE'});
}

export const makersService = {
  update,
  create,
  index,
  show,
  destroy
}
