import {Organization, PaginatedResponse} from "@/app/_types";
import {apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export type FetchOrganizationsParams = {
  search?: string;
  page?: number;
};

async function index(params: FetchOrganizationsParams = {}): Promise<PaginatedResponse<Organization>> {
  const {search = "", page = 1} = params;
  const qs = new URLSearchParams();
  if (search) qs.set("q", search);
  if (page > 1) qs.set("page", String(page));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return await apiFetchPaginated<Organization>(`v1/organizations${query}`);
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

async function update(id: number, data: Partial<Organization>): Promise<Organization> {
  return await apiFetch<Organization>(`v1/organizations/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function updateForm(id: number, data: FormData): Promise<Organization> {
  return await apiFetch<Organization>(`v1/organizations/${id}`, {
    body: data,
    method: 'PATCH',
  });
}

async function destroy(id: number): Promise<void> {
  await apiFetch<void>(`v1/organizations/${id}`, {method: 'DELETE'});
}

export const organizationsService = {
  update,
  updateForm,
  create,
  index,
  show,
  destroy,
}
