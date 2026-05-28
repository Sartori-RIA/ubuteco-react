import {createAsyncThunk} from "@reduxjs/toolkit";
import {ApiError, apiFetch} from "@/app/_services/api-fetch";
import {Food} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export type FoodOption = Pick<Food, "id" | "name">;

const crud = createCrudThunks<Food>("foods", {
  paginated: true,
});

const fetchOptions = createAsyncThunk(
  "foods/fetchOptions",
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiFetch<{ data: FoodOption[] }>("v1/foods/options");
      return response.data;
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Unexpected error"]);
    }
  }
);

export const foodsThunks = {
  ...crud,
  fetchOptions,
};
