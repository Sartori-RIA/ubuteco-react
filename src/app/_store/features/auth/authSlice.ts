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
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
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
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "error";
        state.error = typeof action.payload === "string" ? action.payload : "Could not create account";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
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
      });
  },
});

export const {clearAuthError, resetAuth, setAuthenticatedUser, updateAuthenticatedUser} = authSlice.actions;
export default authSlice.reducer;
