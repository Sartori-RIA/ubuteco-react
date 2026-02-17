import { configureStore } from '@reduxjs/toolkit'
import beerReducer from "@/app/_features/beers/beersSlice";
import wineReducer from "@/app/_features/wines/winesSlice";


export const store = configureStore({
  reducer: {
    beers: beerReducer,
    wines: wineReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch