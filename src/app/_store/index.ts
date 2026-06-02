import {configureStore} from '@reduxjs/toolkit'
import beersReducer from "@/app/_store/features/beers/beersSlice";
import beerStylesReducer from "@/app/_store/features/beer_styles/beerStylesSlice";
import winesReducer from "@/app/_store/features/wines/winesSlice";
import wineStylesReducer from "@/app/_store/features/wine_styles/wineStylesSlice";
import foodsReducer from "@/app/_store/features/foods/foodsSlice";
import drinksReducer from "@/app/_store/features/drinks/drinksSlice";
import dishesReducer from "@/app/_store/features/dishes/dishesSlice";
import tablesReducer from "@/app/_store/features/tables/tablesSlice";
import makersReducer from "@/app/_store/features/makers/makersSlice";
import authReducer from "@/app/_store/features/auth/authSlice";
import ordersReducer from "@/app/_store/features/orders/ordersSlice";
import kitchenReducer from "@/app/_store/features/kitchen/kitchenSlice";

import usersReducer from "@/app/_store/features/users/usersSlice";
import dashboardReducer from "@/app/_store/features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    kitchen: kitchenReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
    beers: beersReducer,
    beerStyles: beerStylesReducer,
    dishes: dishesReducer,
    drinks: drinksReducer,
    foods: foodsReducer,
    makers: makersReducer,
    tables: tablesReducer,
    wines: winesReducer,
    wineStyles: wineStylesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch