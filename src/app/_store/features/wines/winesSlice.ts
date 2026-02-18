import {ApiMetaData, PaginatedResponse, Wine} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {winesThunks} from './winesThunks'

interface WinesState {
  wines: Wine[]
  loading: boolean
  errors?: string[]
  searchTerm: string,
  meta: ApiMetaData
}

const initialState: WinesState = {
  wines: [],
  loading: false,
  errors: undefined,
  searchTerm: '',
  meta: {
    count: 0,
    last: 0,
    page: 1,
    pages: 1,
    previous: null
  }
}

const winesSlice = createSlice({
  name: 'wines',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(winesThunks.fetchAll, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const {meta, data} = action.payload as PaginatedResponse<Wine>
        state.wines = data
        state.meta = meta
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(winesThunks.fetchById, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.wines.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.wines.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(winesThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.wines.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(winesThunks.update, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.wines.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.wines[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(winesThunks.delete, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.wines = state.wines.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
  }
})

export const {setSearchTerm} = winesSlice.actions
export default winesSlice.reducer
