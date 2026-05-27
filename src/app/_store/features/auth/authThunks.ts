import {createAsyncThunk} from "@reduxjs/toolkit";
import {signIn as apiSignIn, signOut as apiSignOut} from "@/app/_services/auth.service";

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

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await apiSignOut();
});
