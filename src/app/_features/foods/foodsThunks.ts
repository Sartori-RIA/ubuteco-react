import {createAsyncThunk} from '@reduxjs/toolkit'
import {RejectValue, Food} from "@/app/_types";
import {ApiError, apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export const fetchFoods = createAsyncThunk(
  'foods/fetchAll',
  async (search: string = "", {rejectWithValue}) => {
    try {
      const query = search ? `?q=${search}` : ''
      return apiFetchPaginated<Food>(`v1/foods${query}`)
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

export const fetchFoodById = createAsyncThunk(
  'foods/fetchById',
  async (id: number, {rejectWithValue}) => {
    try {
      return await apiFetch<Food>(`v1/foods/${id}`)
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

export const createFood = createAsyncThunk<Food, FormData, RejectValue>(
  'foods/create',
  async (data: FormData, {rejectWithValue}) => {
    try {
      return await apiFetch<Food>('v1/foods', {
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

export const updateFood = createAsyncThunk(
  'foods/update',
  async ({id, data}: { id: number; data: FormData }, {rejectWithValue}) => {
    try {
      return await apiFetch<Food>(`v1/foods/${id}`, {
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

export const deleteFood = createAsyncThunk(
  'foods/delete',
  async (id: number, {rejectWithValue}) => {
    try {
      await apiFetch(`v1/foods/${id}`, {method: 'DELETE'})
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
