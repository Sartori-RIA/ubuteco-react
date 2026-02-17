import {createAsyncThunk} from '@reduxjs/toolkit'
import {RejectValue, Dish} from "@/app/_types";
import {ApiError, apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export const fetchDish = createAsyncThunk(
  'dishes/fetchAll',
  async (search: string = "", {rejectWithValue}) => {
    try {
      const query = search ? `?q=${search}` : ''
      return apiFetchPaginated<Dish>(`v1/dishes${query}`)
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

export const fetchDishById = createAsyncThunk(
  'dishes/fetchById',
  async (id: number, {rejectWithValue}) => {
    try {
      return await apiFetch<Dish>(`v1/dishes/${id}`)
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

export const createDish = createAsyncThunk<Dish, FormData, RejectValue>(
  'dishes/create',
  async (data: FormData, {rejectWithValue}) => {
    try {
      return await apiFetch<Dish>('v1/dishes', {
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

export const updateDish = createAsyncThunk(
  'dishes/update',
  async ({id, data}: { id: number; data: FormData }, {rejectWithValue}) => {
    try {
      return await apiFetch<Dish>(`v1/dishes/${id}`, {
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

export const deleteDish = createAsyncThunk(
  'dishes/delete',
  async (id: number, {rejectWithValue}) => {
    try {
      await apiFetch(`v1/dishes/${id}`, {method: 'DELETE'})
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
