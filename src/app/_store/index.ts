import { configureStore } from '@reduxjs/toolkit'
import beerReducer from "@/app/_features/beers/beersSlice";
import wineReducer from "@/app/_features/wines/winesSlice";
import foodsReducer from "@/app/_features/foods/foodsSlice";
import drinksReducer from "@/app/_features/drinks/drinksSlice";
import dishesReducer from "@/app/_features/dishes/dishesSlice";


export const store = configureStore({
  reducer: {
    beers: beerReducer,
    wines: wineReducer,
    foods: foodsReducer,
    drinks: drinksReducer,
    dishes: dishesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch