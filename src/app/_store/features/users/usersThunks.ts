import {createAsyncThunk} from "@reduxjs/toolkit";
import {User, UserCreatePayload, UserUpdatePayload} from "@/app/_types";
import {ApiError} from "@/app/_services/api-fetch";
import {FetchUsersParams, usersService} from "@/app/_services/users.service";

export type FetchUsersResult = {
  data: User[];
  meta: Awaited<ReturnType<typeof usersService.fetchAll>>["meta"];
  append: boolean;
};

const fetchAll = createAsyncThunk(
  "users/fetchAll",
  async (params: FetchUsersParams & {append?: boolean} = {}, {rejectWithValue}) => {
    try {
      const result = await usersService.fetchAll(params);
      return {...result, append: params.append ?? false};
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not load users"]);
    }
  }
);

const fetchById = createAsyncThunk(
  "users/fetchById",
  async (id: number, {rejectWithValue}) => {
    try {
      return await usersService.show(id);
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not load user"]);
    }
  }
);

const createUser = createAsyncThunk(
  "users/create",
  async (data: UserCreatePayload, {rejectWithValue}) => {
    try {
      return await usersService.create(data);
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not create user"]);
    }
  }
);

const updateUser = createAsyncThunk(
  "users/update",
  async ({id, data}: {id: number; data: UserUpdatePayload}, {rejectWithValue}) => {
    try {
      return await usersService.update(id, data);
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not update user"]);
    }
  }
);

const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number, {rejectWithValue}) => {
    try {
      await usersService.destroy(id);
      return id;
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not delete user"]);
    }
  }
);

export const usersThunks = {
  fetchAll,
  fetchById,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
};
