import {BeerStyle} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {beerStylesThunks} from './beerStylesThunks'

interface BeerStylesState {
  beerStyles: BeerStyle[]
  loading: boolean
  errors?: string[]
  searchTerm: string
}

const initialState: BeerStylesState = {
  beerStyles: [],
  loading: false,
  errors: undefined,
  searchTerm: ''
}

const beerStylesSlice = createSlice({
  name: 'beerStyles',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(beerStylesThunks.fetchAll, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.beerStyles = action.payload as BeerStyle[]
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(beerStylesThunks.fetchById, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.beerStyles.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.beerStyles.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(beerStylesThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.beerStyles.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(beerStylesThunks.update, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.beerStyles.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.beerStyles[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(beerStylesThunks.delete, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.beerStyles = state.beerStyles.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
  }
})

export const {setSearchTerm} = beerStylesSlice.actions
export default beerStylesSlice.reducer
