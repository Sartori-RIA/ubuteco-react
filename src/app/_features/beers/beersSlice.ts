// features/beers/beersSlice.ts
import {createSlice} from '@reduxjs/toolkit'

import {createBeer, deleteBeer, fetchBeerById, fetchBeers, updateBeer,} from './beersThunks'
import {ApiMetaData, Beer} from "@/app/_types";

interface BeersState {
  beers: Beer[]
  loading: boolean
  errors?: string[]
  searchTerm: string,
  meta: ApiMetaData
}

const initialState: BeersState = {
  beers: [],
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

const beersSlice = createSlice({
  name: 'beers',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addAsyncThunk(fetchBeers, {
        pending: (state) => {
          state.loading = true
        },
        fulfilled: (state, action) => {
          state.loading = false
          state.beers = action.payload.data
          state.meta = action.payload.meta
        },
        rejected: (state, action) => {
          state.loading = false
          state.errors = action.payload?.errors
        }
      })
      .addAsyncThunk(fetchBeerById, {
        pending: (state) => {
          state.loading = true
        },
        fulfilled: (state, action) => {
          state.loading = false
          const existing = state.beers.find(b => b.id === action.payload.id)

          if (existing) {
            Object.assign(existing, action.payload)
          } else {
            state.beers.push(action.payload)
          }

        },
        rejected: (state, action) => {
          state.loading = false
          state.errors = action.payload?.errors
        },
      })
      .addAsyncThunk(createBeer, {
        pending: (state) => {
          state.loading = true
        },
        fulfilled: (state, action) => {
          state.loading = false
          state.beers.push(action.payload)
        },
        rejected: (state, action) => {
          state.loading = false
          state.errors = action.payload?.errors
        },
      })
      .addAsyncThunk(updateBeer, {
        pending: (state, action) => {
          state.loading = true
        },
        fulfilled: (state, action) => {
          state.loading = false
          const index = state.beers.findIndex(b => b.id === action.payload.id)
          if (index !== -1) {
            state.beers[index] = action.payload
          }
        },
        rejected: (state, action) => {
          state.loading = false
          state.errors = action.payload?.errors
        }
      })
      .addAsyncThunk(deleteBeer, {
        pending: (state) => {
          state.loading = true
        },
        fulfilled: (state, action) => {
          state.loading = false
          state.beers = state.beers.filter(b => b.id !== action.payload)
        },
        rejected: (state, action) => {
          state.loading = false
          state.errors = action.payload?.errors
        }
      })
  },
})

export const {setSearchTerm} = beersSlice.actions
export default beersSlice.reducer
