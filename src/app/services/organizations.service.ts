import {Organization} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Organization[]> {
  return await apiFetch<Organization[]>('/organizations');
}

async function show(id: number): Promise<Organization> {
  return await apiFetch<Organization>(`/organizations/${id}`);
}

async function create(data: Organization): Promise<Organization> {
  return await apiFetch<Organization>('/organizations', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Organization): Promise<Organization> {
  return await apiFetch<Organization>(`/organizations/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  await apiFetch<void>(`/organizations/${id}`, {method: 'DELETE'});
}

export const organizationsService = {
  update,
  create,
  index,
  show,
  destroy,
}
