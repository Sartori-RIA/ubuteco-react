import {configureStore} from '@reduxjs/toolkit'
import beersReducer from "@/app/_store/features/beers/beersSlice";
import beerStylesReducer from "@/app/_store/features/beer_styles/beerStylesSlice";
import winesReducer from "@/app/_store/features/wines/winesSlice";
import wineStylesReducer from "@/app/_store/features/wine_styles/wineStylesSlice";
import foodsReducer from "@/app/_store/features/foods/foodsSlice";
import drinksReducer from "@/app/_store/features/drinks/drinksSlice";
import dishesReducer from "@/app/_store/features/dishes/dishesSlice";
import tablesReducer from "@/app/_store/features/tables/tablesSlice";

export const store = configureStore({
  reducer: {
    beers: beersReducer,
    beerStyles: beerStylesReducer,
    wines: winesReducer,
    wineStyles: wineStylesReducer,
    foods: foodsReducer,
    drinks: drinksReducer,
    dishes: dishesReducer,
    tables: tablesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch