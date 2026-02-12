import {Organization} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<Organization[]> {
  return await apiFetch<Organization[]>('v1/organizations');
}

async function show(id: number): Promise<Organization> {
  return await apiFetch<Organization>(`v1/organizations/${id}`);
}

async function create(data: Organization): Promise<Organization> {
  return await apiFetch<Organization>('v1/organizations', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: Organization): Promise<Organization> {
  return await apiFetch<Organization>(`v1/organizations/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  await apiFetch<void>(`v1/organizations/${id}`, {method: 'DELETE'});
}

export const organizationsService = {
  update,
  create,
  index,
  show,
  destroy,
}
