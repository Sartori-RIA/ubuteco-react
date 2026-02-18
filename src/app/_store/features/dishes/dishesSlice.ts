import {ApiMetaData, Dish, PaginatedResponse} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {dishesThunks} from './dishesThunks'

interface DishsState {
  dishes: Dish[]
  loading: boolean
  errors?: string[]
  searchTerm: string,
  meta: ApiMetaData
}

const initialState: DishsState = {
  dishes: [],
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

const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(dishesThunks.fetchAll, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const {meta, data} = action.payload as PaginatedResponse<Dish>
        state.dishes = data
        state.meta = meta
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(dishesThunks.fetchById, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.dishes.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.dishes.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(dishesThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.dishes.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(dishesThunks.update, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.dishes.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.dishes[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(dishesThunks.delete, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.dishes = state.dishes.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
  }
})

export const {setSearchTerm} = dishesSlice.actions
export default dishesSlice.reducer
