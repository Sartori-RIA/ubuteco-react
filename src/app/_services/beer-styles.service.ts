import {BeerStyle} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

async function index(): Promise<BeerStyle[]> {
  return await apiFetch<BeerStyle[]>('v1/beer_styles');
}

async function show(id: number): Promise<BeerStyle> {
  return await apiFetch<BeerStyle>(`v1/beer_styles/${id}`);
}

async function create(data: BeerStyle): Promise<BeerStyle> {
  return await apiFetch<BeerStyle>('v1/beer_styles', {
    body: JSON.stringify(data),
    method: 'POST'
  });
}

async function update(id: number, data: BeerStyle): Promise<BeerStyle> {
  return await apiFetch<BeerStyle>(`v1/beer_styles/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH'
  });
}

async function destroy(id: number): Promise<void> {
  return await apiFetch<void>(`v1/beer_styles/${id}`, {method: 'DELETE'});
}

export const beerStylesService = {
  update,
  create,
  index,
  show,
  destroy
}
