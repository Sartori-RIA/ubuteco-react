import {Table} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

async function index(): Promise<Table[]> {
  return await apiFetch<Table[]>('v1/tables');
}

async function show(id: number): Promise<Table> {
  return await apiFetch<Table>(`v1/tables/${id}`);
}

async function create(data: Table): Promise<Table> {
  return await apiFetch<Table>('v1/tables', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Table): Promise<Table> {
  return await apiFetch<Table>(`v1/tables/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/tables/${id}`, {method: 'DELETE'});
}

export const tablesService = {
  update,
  create,
  index,
  show,
  destroy,
}
