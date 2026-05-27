import {ApiMetaData, Maker, PaginatedResponse} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {makersThunks} from './makersThunks'

interface MakersState {
  makers: Maker[]
  loading: boolean
  errors?: string[]
  searchTerm: string
  meta: ApiMetaData
}

const initialState: MakersState = {
  makers: [],
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

const makersSlice = createSlice({
  name: 'makers',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(makersThunks.fetchAll, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const {meta, data} = action.payload as PaginatedResponse<Maker>
        state.makers = data
        state.meta = meta
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(makersThunks.fetchById, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.makers.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.makers.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(makersThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.makers.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(makersThunks.update, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.makers.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.makers[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(makersThunks.delete, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.makers = state.makers.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
  }
})

export const {setSearchTerm} = makersSlice.actions
export default makersSlice.reducer
