import {ProfileUpdatePayload, User} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

async function index(): Promise<User[]> {
  return await apiFetch<User[]>('v1/users');
}

async function show(id: number): Promise<User> {
  return await apiFetch<User>(`v1/users/${id}`);
}

async function create(data: User): Promise<User> {
  return await apiFetch<User>('v1/users', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: User | ProfileUpdatePayload): Promise<User> {
  return await apiFetch<User>(`v1/users/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function updateProfile(id: number, data: ProfileUpdatePayload): Promise<User> {
  return update(id, data);
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/users/${id}`, {method: 'DELETE'});
}

export const usersService = {
  update,
  updateProfile,
  create,
  index,
  show,
  destroy,
}
