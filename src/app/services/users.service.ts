import {User} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<User[]> {
  return await apiFetch<User[]>('/users');
}

async function show(id: number): Promise<User> {
  return await apiFetch<User>(`/users/${id}`);
}

async function create(data: User): Promise<User> {
  return await apiFetch<User>('/users', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: User): Promise<User> {
  return await apiFetch<User>(`/users/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`/users/${id}`, {method: 'DELETE'});
}

export const usersService = {
  update,
  create,
  index,
  show,
  destroy,
}
