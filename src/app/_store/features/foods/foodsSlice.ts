import {ApiMetaData, Food} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {foodsThunks} from './foodsThunks'

interface FoodsState {
  foods: Food[]
  loading: boolean
  errors?: string[]
  searchTerm: string,
  meta: ApiMetaData
}

const initialState: FoodsState = {
  foods: [],
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

const foodsSlice = createSlice({
  name: 'foods',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(foodsThunks.fetchAll, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.foods = action.payload.data
        state.meta = action.payload.meta
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(foodsThunks.fetchById, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.foods.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.foods.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(foodsThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.foods.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(foodsThunks.update, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.foods.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.foods[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(foodsThunks.delete, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.foods = state.foods.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
  }
})

export const {setSearchTerm} = foodsSlice.actions
export default foodsSlice.reducer
