import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiFetch, apiFetchPaginated } from "@/app/_services/api-fetch"

type CrudOptions = {
  paginated?: boolean
}

export function createCrudThunks<T>(
  entity: string,
  options: CrudOptions = {}
) {
  const { paginated = false } = options

  const fetchAll = createAsyncThunk(
    `${entity}/fetchAll`,
    async (params: { search?: string } = {}, { rejectWithValue }) => {
      try {
        const { search = "" } = params
        const query = search ? `?q=${search}` : ""

        if (paginated) {
          return await apiFetchPaginated<T>(`v1/${entity}${query}`)
        }

        return await apiFetch<T[]>(`v1/${entity}${query}`)
      } catch (err) {
        return rejectWithValue(err)
      }
    }
  )

  return {
    fetchAll,
    fetchById: createAsyncThunk(
      `${entity}/fetchById`,
      async (id: number, { rejectWithValue }) => {
        try {
          return await apiFetch<T>(`v1/${entity}/${id}`)
        } catch (err) {
          return rejectWithValue(err)
        }
      }
    ),

    create: createAsyncThunk(
      `${entity}/create`,
      async (data: FormData, { rejectWithValue }) => {
        try {
          return await apiFetch<T>(`v1/${entity}`, {
            method: "POST",
            body: data,
          })
        } catch (err) {
          return rejectWithValue(err)
        }
      }
    ),

    update: createAsyncThunk(
      `${entity}/update`,
      async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
        try {
          return await apiFetch<T>(`v1/${entity}/${id}`, {
            method: "PUT",
            body: data,
          })
        } catch (err) {
          return rejectWithValue(err)
        }
      }
    ),

    delete: createAsyncThunk(
      `${entity}/delete`,
      async (id: number, { rejectWithValue }) => {
        try {
          await apiFetch(`v1/${entity}/${id}`, { method: "DELETE" })
          return id
        } catch (err) {
          return rejectWithValue(err)
        }
      }
    ),
  }
}
