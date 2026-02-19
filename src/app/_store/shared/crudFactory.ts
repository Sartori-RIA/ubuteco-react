import {createAsyncThunk} from "@reduxjs/toolkit"
import {ApiError, apiFetch, apiFetchPaginated} from "@/app/_services/api-fetch"

type CrudOptions = {
  paginated?: boolean
}

export function createCrudThunks<T>(
  entity: string,
  options: CrudOptions = {}
) {
  const {paginated = false} = options

  const fetchAll = createAsyncThunk(
    `${entity}/fetchAll`,
    async (params: { search?: string } = {}, {rejectWithValue}) => {
      try {
        const {search = ""} = params
        const query = search ? `?q=${search}` : ""

        if (paginated) {
          return await apiFetchPaginated<T>(`v1/${entity}${query}`)
        }

        return await apiFetch<T[]>(`v1/${entity}${query}`)
      } catch (err) {
        if (err instanceof ApiError) {
          return rejectWithValue(err.data);
        }
        return rejectWithValue(["Unexpected error"]);
      }
    }
  )

  return {
    fetchAll,
    fetchById: createAsyncThunk(
      `${entity}/fetchById`,
      async (id: number, {rejectWithValue}) => {
        try {
          return await apiFetch<T>(`v1/${entity}/${id}`)
        } catch (err) {
          if (err instanceof ApiError) {
            return rejectWithValue(err.data);
          }
          return rejectWithValue(["Unexpected error"]);
        }
      }
    ),

    create: createAsyncThunk(
      `${entity}/create`,
      async (data: FormData | T, {rejectWithValue}) => {
        try {
          let body
          if (data instanceof FormData) {
            body = data
          } else {
            body = JSON.stringify(data)
          }
          return await apiFetch<T>(`v1/${entity}`, {
            method: "POST",
            body,
          })
        } catch (err) {
          if (err instanceof ApiError) {
            return rejectWithValue(err.data);
          }
          return rejectWithValue(["Unexpected error"]);
        }
      }
    ),

    update: createAsyncThunk(
      `${entity}/update`,
      async ({id, data}: { id: number; data: FormData | T }, {rejectWithValue}) => {
        try {
          let body
          if (data instanceof FormData) {
            body = data
          } else {
            body = JSON.stringify(data)
          }
          return await apiFetch<T>(`v1/${entity}/${id}`, {
            method: "PUT",
            body,
          })
        } catch (err) {
          if (err instanceof ApiError) {
            return rejectWithValue(err.data);
          }
          return rejectWithValue(["Unexpected error"]);
        }
      }
    ),

    delete: createAsyncThunk(
      `${entity}/delete`,
      async (id: number, {rejectWithValue}) => {
        try {
          await apiFetch(`v1/${entity}/${id}`, {method: "DELETE"})
          return id
        } catch (err) {
          if (err instanceof ApiError) {
            return rejectWithValue(err.data);
          }
          return rejectWithValue(["Unexpected error"]);
        }
      }
    ),
  }
}
