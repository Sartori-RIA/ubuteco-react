import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/app/_types";
import {
  fetchCurrentUser,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "./authThunks";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;
  currentUserFetchPending: boolean;
  currentUserFetchedAt: number | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  currentUserFetchPending: false,
  currentUserFetchedAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    resetAuth(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.currentUserFetchPending = false;
      state.currentUserFetchedAt = null;
    },
    setAuthenticatedUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = "authenticated";
      state.error = null;
    },
    updateAuthenticatedUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = "authenticated";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
        state.currentUserFetchedAt = Date.now();
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "error";
        state.error = typeof action.payload === "string" ? action.payload : "Authentication failed";
        state.user = null;
      })
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
        state.currentUserFetchedAt = Date.now();
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "error";
        state.error = typeof action.payload === "string" ? action.payload : "Could not create account";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.currentUserFetchPending = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
        state.currentUserFetchedAt = Date.now();
        state.currentUserFetchPending = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.currentUserFetchPending = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.currentUserFetchPending = false;
        state.currentUserFetchedAt = null;
      });
  },
});

export const {clearAuthError, resetAuth, setAuthenticatedUser, updateAuthenticatedUser} = authSlice.actions;
export default authSlice.reducer;
