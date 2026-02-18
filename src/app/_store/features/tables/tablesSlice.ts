import {ApiMetaData, PaginatedResponse, Table} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {tablesThunks} from './tablesThunks'

interface TablesState {
  tables: Table[]
  loading: boolean
  errors?: string[]
  searchTerm: string
}

const initialState: TablesState = {
  tables: [],
  loading: false,
  errors: undefined,
  searchTerm: ''
}

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(tablesThunks.fetchAll, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.tables = action.payload as Table[]
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(tablesThunks.fetchById, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.tables.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.tables.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(tablesThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.tables.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(tablesThunks.update, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.tables.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.tables[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(tablesThunks.delete, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.tables = state.tables.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
  }
})

export const {setSearchTerm} = tablesSlice.actions
export default tablesSlice.reducer
