import {createAsyncThunk} from '@reduxjs/toolkit'
import {RejectValue, Drink} from "@/app/_types";
import {ApiError, apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch";

export const fetchDrink = createAsyncThunk(
  'drinks/fetchAll',
  async (search: string = "", {rejectWithValue}) => {
    try {
      const query = search ? `?q=${search}` : ''
      return apiFetchPaginated<Drink>(`v1/drinks${query}`)
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

export const fetchDrinkById = createAsyncThunk(
  'drinks/fetchById',
  async (id: number, {rejectWithValue}) => {
    try {
      return await apiFetch<Drink>(`v1/drinks/${id}`)
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

export const createDrink = createAsyncThunk<Drink, FormData, RejectValue>(
  'drinks/create',
  async (data: FormData, {rejectWithValue}) => {
    try {
      return await apiFetch<Drink>('v1/drinks', {
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

export const updateDrink = createAsyncThunk(
  'drinks/update',
  async ({id, data}: { id: number; data: FormData }, {rejectWithValue}) => {
    try {
      return await apiFetch<Drink>(`v1/drinks/${id}`, {
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

export const deleteDrink = createAsyncThunk(
  'drinks/delete',
  async (id: number, {rejectWithValue}) => {
    try {
      await apiFetch(`v1/drinks/${id}`, {method: 'DELETE'})
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
