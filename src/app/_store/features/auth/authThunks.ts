import {createAsyncThunk} from "@reduxjs/toolkit";
import {SignUpPayload} from "@/app/_types";
import {getAuthUser} from "@/app/_lib/auth-storage";
import {usersService} from "@/app/_services/users.service";
import {
  AuthError,
  requestPasswordReset as apiRequestPasswordReset,
  setPasswordFromLink,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
} from "@/app/_services/auth.service";
import {RootState} from "@/app/_store";
import {isCurrentUserFetchFresh} from "./auth-fetch-cache";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({email, password}: {email: string; password: string}, {rejectWithValue}) => {
    try {
      return await apiSignIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Authentication failed");
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (payload: SignUpPayload, {rejectWithValue}) => {
    try {
      return await apiSignUp(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Could not create account");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email: string, {rejectWithValue}) => {
    try {
      await apiRequestPasswordReset(email);
      return email;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Could not send reset code");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({token, password}: {token: string; password: string}, {rejectWithValue}) => {
    try {
      await setPasswordFromLink(token, password);
      return null;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue({message: error.message, payload: error.payload});
      }
      if (error instanceof Error) {
        return rejectWithValue({message: error.message});
      }
      return rejectWithValue({message: "Could not reset password"});
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, {getState, rejectWithValue}) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.id ?? getAuthUser()?.id;
    if (!userId) {
      return rejectWithValue("No authenticated user");
    }

    try {
      return await usersService.show(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Could not load user profile");
    }
  },
  {
    condition: (_, {getState}) => {
      const auth = (getState() as RootState).auth;
      if (auth.currentUserFetchPending) return false;
      if (auth.user && isCurrentUserFetchFresh(auth.currentUserFetchedAt)) return false;
      return true;
    },
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await apiSignOut();
});
