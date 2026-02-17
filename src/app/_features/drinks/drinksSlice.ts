import {ApiMetaData, Drink} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {createDrink, deleteDrink, fetchDrink, fetchDrinkById, updateDrink} from './drinksThunks'

interface DrinksState {
  drinks: Drink[]
  loading: boolean
  errors?: string[]
  searchTerm: string,
  meta: ApiMetaData
}

const initialState: DrinksState = {
  drinks: [],
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

const drinksSlice = createSlice({
  name: 'drinks',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(fetchDrink, {
      pending: (state, action) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.drinks = action.payload.data
        state.meta = action.payload.meta
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(fetchDrinkById, {
      pending: (state, action) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.drinks.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.drinks.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(createDrink, {
      pending: (state, action) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.drinks.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(updateDrink, {
      pending: (state, action) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.drinks.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.drinks[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
    builder.addAsyncThunk(deleteDrink, {
      pending: (state, action) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.drinks = state.drinks.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        // @ts-expect-error: "the error exists!"
        state.errors = action.payload?.errors
      }
    })
  }
})

export const {setSearchTerm} = drinksSlice.actions
export default drinksSlice.reducer
