import {
  PaginatedResponse,
  ProfileUpdatePayload,
  User,
  UserCreatePayload,
  UserUpdatePayload,
} from "@/app/_types";
import {apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export type FetchUsersParams = {
  search?: string;
  page?: number;
};

async function fetchAll(params: FetchUsersParams = {}): Promise<PaginatedResponse<User>> {
  const {search = "", page = 1} = params;
  const qs = new URLSearchParams();
  if (search) qs.set("q", search);
  if (page > 1) qs.set("page", String(page));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return await apiFetchPaginated<User>(`v1/users${query}`);
}

async function show(id: number): Promise<User> {
  return await apiFetch<User>(`v1/users/${id}`);
}

async function create(data: UserCreatePayload): Promise<User> {
  return await apiFetch<User>("v1/users", {
    body: JSON.stringify(data),
    method: "POST",
  });
}

async function update(id: number, data: UserUpdatePayload | ProfileUpdatePayload): Promise<User> {
  return await apiFetch<User>(`v1/users/${id}`, {
    body: JSON.stringify(data),
    method: "PUT",
  });
}

async function updateProfile(id: number, data: ProfileUpdatePayload): Promise<User> {
  return update(id, data);
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/users/${id}`, {method: "DELETE"});
}

export const usersService = {
  fetchAll,
  show,
  create,
  update,
  updateProfile,
  destroy,
};
