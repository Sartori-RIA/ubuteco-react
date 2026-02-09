import {WineStyle} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<WineStyle[]> {
  return await apiFetch<WineStyle[]>('/wine-styles');
}

async function show(id: number): Promise<WineStyle> {
  return await apiFetch<WineStyle>(`/wine-styles/${id}`);
}

async function create(data: WineStyle): Promise<WineStyle> {
  return await apiFetch<WineStyle>('/wine-styles', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: WineStyle): Promise<WineStyle> {
  return await apiFetch<WineStyle>(`/wine-styles/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`/wine-styles/${id}`, {method: 'DELETE'});
}

export const wineStylesService = {
  update,
  create,
  index,
  show,
  destroy
}
