import {createAsyncThunk } from '@reduxjs/toolkit'
import {Beer, RejectValue} from "@/app/_types";
import {ApiError, apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export const fetchBeers = createAsyncThunk(
  'beers/fetchAll',
  async (search: string = "", {rejectWithValue}) => {
    try {
      const query = search ? `?q=${search}` : ''
      return apiFetchPaginated<Beer>(`v1/beers${query}`)
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue({
          status: err.status,
          errors: err.data,
        })
      }
      throw err
    }
  }
)

export const fetchBeerById = createAsyncThunk(
  'beers/fetchById',
  async (id: number, {rejectWithValue}) => {
    try {
      return await apiFetch<Beer>(`v1/beers/${id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue({
          status: err.status,
          errors: err.data,
        })
      }
      throw err
    }
  }
)

export const createBeer = createAsyncThunk<Beer, FormData, RejectValue>(
  'beers/create',
  async (data: FormData, {rejectWithValue}) => {
    try {
      return await apiFetch<Beer>('v1/beers', {
        method: 'POST',
        body: data,
        cache: 'no-cache'
      })
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue({
          status: err.status,
          errors: err.data,
        })
      }
      throw err
    }
  }
)

export const updateBeer = createAsyncThunk(
  'beers/update',
  async ({id, data}: { id: number; data: FormData }, {rejectWithValue}) => {
    try {
      return await apiFetch<Beer>(`v1/beers/${id}`, {
        method: 'PUT',
        body: data,
      })
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue({
          status: err.status,
          errors: err.data,
        })
      }
      throw err
    }
  }
)

export const deleteBeer = createAsyncThunk(
  'beers/delete',
  async (id: number, {rejectWithValue}) => {
    try {
      await apiFetch(`v1/beers/${id}`, {method: 'DELETE'})
      return id
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue({
          status: err.status,
          errors: err.data,
        })
      }
      throw err
    }
  }
)
