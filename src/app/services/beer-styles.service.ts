import {Beer, BeerStyle} from "@/app/types";
import {apiFetch} from "@/app/services/api-fetch";

async function index(): Promise<BeerStyle[]> {
  return await apiFetch<BeerStyle[]>('/beer-styles');
}

async function show(id: number): Promise<BeerStyle> {
  return await apiFetch<BeerStyle>(`/beer-styles/${id}`);
}

async function create(data: BeerStyle): Promise<BeerStyle> {
  return await apiFetch<BeerStyle>('/beer-styles', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: BeerStyle): Promise<BeerStyle> {
  return await apiFetch<BeerStyle>(`/beer-styles/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`/beer-styles/${id}`, {method: 'DELETE'});
}

export const beerStylesService = {
  update,
  create,
  index,
  show,
  destroy
}
