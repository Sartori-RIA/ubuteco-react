// features/wines/beersThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit'
import {RejectValue, Wine} from "@/app/_types";
import {ApiError, apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export const fetchWine = createAsyncThunk(
  'wines/fetchAll',
  async (search: string = "", {rejectWithValue}) => {
    try {
      const query = search ? `?q=${search}` : ''
      return apiFetchPaginated<Wine>(`v1/wines${query}`)
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

export const fetchWineById = createAsyncThunk(
  'wines/fetchById',
  async (id: number, {rejectWithValue}) => {
    try {
      return await apiFetch<Wine>(`v1/wines/${id}`)
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

export const createWine = createAsyncThunk<Wine, FormData, RejectValue>(
  'wines/create',
  async (data: FormData, {rejectWithValue}) => {
    try {
      return await apiFetch<Wine>('v1/wines', {
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

export const updateWine = createAsyncThunk(
  'wines/update',
  async ({id, data}: { id: number; data: FormData }, {rejectWithValue}) => {
    try {
      return await apiFetch<Wine>(`v1/wines/${id}`, {
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

export const deleteWine = createAsyncThunk(
  'wines/delete',
  async (id: number, {rejectWithValue}) => {
    try {
      await apiFetch(`v1/wines/${id}`, {method: 'DELETE'})
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
