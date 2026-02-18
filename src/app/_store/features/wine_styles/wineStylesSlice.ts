import {WineStyle} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {wineStylesThunks} from './wineStylesThunks'

interface WineStylesState {
  wineStyles: WineStyle[]
  loading: boolean
  errors?: string[]
  searchTerm: string
}

const initialState: WineStylesState = {
  wineStyles: [],
  loading: false,
  errors: undefined,
  searchTerm: ''
}

const wineStylesSlice = createSlice({
  name: 'wineStyles',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(wineStylesThunks.fetchAll, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.wineStyles = action.payload as WineStyle[]
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(wineStylesThunks.fetchById, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const existing = state.wineStyles.find(b => b.id === action.payload.id)

        if (existing) {
          Object.assign(existing, action.payload)
        } else {
          state.wineStyles.push(action.payload)
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(wineStylesThunks.create, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.wineStyles.push(action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(wineStylesThunks.update, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        const index = state.wineStyles.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.wineStyles[index] = action.payload
        }
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
    builder.addAsyncThunk(wineStylesThunks.delete, {
      pending: (state) => {
        state.loading = true
      },
      fulfilled: (state, action) => {
        state.loading = false
        state.wineStyles = state.wineStyles.filter(b => b.id !== action.payload)
      },
      rejected: (state, action) => {
        state.loading = false
        state.errors = action.payload as string[]
      }
    })
  }
})

export const {setSearchTerm} = wineStylesSlice.actions
export default wineStylesSlice.reducer
