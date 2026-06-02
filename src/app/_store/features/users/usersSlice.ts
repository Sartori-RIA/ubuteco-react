import {ApiMetaData, PaginatedResponse, User} from "@/app/_types";
import {createSlice} from "@reduxjs/toolkit";
import {usersThunks} from "./usersThunks";

interface UsersState {
  users: User[];
  loading: boolean;
  errors?: string[];
  searchTerm: string;
  page: number;
  meta: ApiMetaData;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  errors: undefined,
  searchTerm: "",
  page: 1,
  meta: {
    count: 0,
    last: 0,
    page: 1,
    pages: 1,
    previous: null,
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(usersThunks.fetchAll, {
      pending: (state) => {
        state.loading = true;
        state.errors = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        const {meta, data, append} = action.payload as PaginatedResponse<User> & {append: boolean};
        state.meta = meta;
        state.page = meta.page;
        state.users = append ? [...state.users, ...data] : data;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(usersThunks.fetchById, {
      pending: (state) => {
        state.loading = true;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        const existing = state.users.find((user) => user.id === action.payload.id);
        if (existing) {
          Object.assign(existing, action.payload);
        } else {
          state.users.push(action.payload);
        }
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(usersThunks.create, {
      pending: (state) => {
        state.loading = true;
        state.errors = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(usersThunks.update, {
      pending: (state) => {
        state.loading = true;
        state.errors = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(usersThunks.delete, {
      pending: (state) => {
        state.loading = true;
        state.errors = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
  },
});

export const {setSearchTerm, setPage} = usersSlice.actions;
export default usersSlice.reducer;
