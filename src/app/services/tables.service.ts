import {Table} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Table[]> {
  return await apiFetch<Table[]>('/tables');
}

async function show(id: number): Promise<Table> {
  return await apiFetch<Table>(`/tables/${id}`);
}

async function create(data: Table): Promise<Table> {
  return await apiFetch<Table>('/tables', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Table): Promise<Table> {
  return await apiFetch<Table>(`/tables/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`/tables/${id}`, {method: 'DELETE'});
}

export const tablesService = {
  update,
  create,
  index,
  show,
  destroy,
}
