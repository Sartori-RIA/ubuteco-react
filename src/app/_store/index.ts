import { configureStore } from '@reduxjs/toolkit'
import beerReducer from "@/app/_features/beers/beersSlice";


export const store = configureStore({
  reducer: {
    beers: beerReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch