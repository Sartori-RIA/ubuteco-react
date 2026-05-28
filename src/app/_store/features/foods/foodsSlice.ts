import {ApiMetaData, Food, PaginatedResponse} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {FoodOption, foodsThunks} from './foodsThunks'

interface FoodsState {
  foods: Food[]
  foodOptions: FoodOption[]
  loading: boolean
  optionsLoading: boolean
  errors?: string[]
  searchTerm: string,
  meta: ApiMetaData
}

const initialState: FoodsState = {
  foods: [],
  foodOptions: [],
  loading: false,
  optionsLoading: false,
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
        const {meta, data} = action.payload as PaginatedResponse<Food>
        state.foods = data
        state.meta = meta
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(foodsThunks.fetchOptions, {
      pending: (state) => {
        state.optionsLoading = true
      },
      fulfilled: (state, action) => {
        state.optionsLoading = false
        state.foodOptions = action.payload
      },
      rejected: (state) => {
        state.optionsLoading = false
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
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(foodsThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.foods.push(action.payload)
        const option = {id: action.payload.id, name: action.payload.name}
        if (!state.foodOptions.some((food) => food.id === option.id)) {
          state.foodOptions.push(option)
          state.foodOptions.sort((a, b) => a.name.localeCompare(b.name))
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
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
        state.errors = action.payload as string[]
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
        state.errors = action.payload as string[]
      }
    })
  }
})

export const {setSearchTerm} = foodsSlice.actions
export default foodsSlice.reducer
