import {Organization, PaginatedResponse} from "@/app/_types";
import {apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export type FetchPlatformOrganizationsParams = {
  search?: string;
  page?: number;
};

async function fetchAll(
  params: FetchPlatformOrganizationsParams = {}
): Promise<PaginatedResponse<Organization>> {
  const {search = "", page = 1} = params;
  const qs = new URLSearchParams();
  if (search) qs.set("q", search);
  if (page > 1) qs.set("page", String(page));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return await apiFetchPaginated<Organization>(`v1/platform/organizations${query}`);
}

async function show(id: number): Promise<Organization> {
  return await apiFetch<Organization>(`v1/platform/organizations/${id}`);
}

async function update(id: number, data: Partial<Organization>): Promise<Organization> {
  return await apiFetch<Organization>(`v1/platform/organizations/${id}`, {
    body: JSON.stringify(data),
    method: "PATCH",
  });
}

async function updateForm(id: number, data: FormData): Promise<Organization> {
  return await apiFetch<Organization>(`v1/platform/organizations/${id}`, {
    body: data,
    method: "PATCH",
  });
}

export const platformOrganizationsService = {
  fetchAll,
  show,
  update,
  updateForm,
};
