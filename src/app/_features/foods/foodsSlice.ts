import {ApiMetaData, Food} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {createFood, deleteFood, fetchFoods, fetchFoodById, updateFood} from './foodsThunks'

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
    builder.addAsyncThunk(fetchFoods, {
      pending: (state, action) => {
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
    builder.addAsyncThunk(fetchFoodById, {
      pending: (state, action) => {
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
    builder.addAsyncThunk(createFood, {
      pending: (state, action) => {
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
    builder.addAsyncThunk(updateFood, {
      pending: (state, action) => {
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
    builder.addAsyncThunk(deleteFood, {
      pending: (state, action) => {
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
