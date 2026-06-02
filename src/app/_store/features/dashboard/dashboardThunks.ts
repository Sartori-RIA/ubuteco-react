import {createAsyncThunk} from "@reduxjs/toolkit";
import {dashboardService} from "@/app/_services/dashboard.service";
import {ApiError} from "@/app/_services/api-fetch";
import {DashboardFetchParams} from "@/app/_types";

export const dashboardThunks = {
  fetchSummary: createAsyncThunk(
    "dashboard/fetchSummary",
    async (params: DashboardFetchParams, {rejectWithValue}) => {
      try {
        return await dashboardService.fetchSummary(params);
      } catch (err) {
        if (err instanceof ApiError) {
          return rejectWithValue(err.data);
        }
        return rejectWithValue(["Unexpected error"]);
      }
    }
  ),
  fetchSeries: createAsyncThunk(
    "dashboard/fetchSeries",
    async (params: DashboardFetchParams, {rejectWithValue}) => {
      try {
        return await dashboardService.fetchSeries({...params, metric: "revenue", grain: "day"});
      } catch (err) {
        if (err instanceof ApiError) {
          return rejectWithValue(err.data);
        }
        return rejectWithValue(["Unexpected error"]);
      }
    }
  ),
  fetchKitchen: createAsyncThunk(
    "dashboard/fetchKitchen",
    async (params: DashboardFetchParams, {rejectWithValue}) => {
      try {
        return await dashboardService.fetchKitchen(params);
      } catch (err) {
        if (err instanceof ApiError) {
          return rejectWithValue(err.data);
        }
        return rejectWithValue(["Unexpected error"]);
      }
    }
  ),
  fetchAll: createAsyncThunk(
    "dashboard/fetchAll",
    async (params: DashboardFetchParams, {dispatch, rejectWithValue}) => {
      const results = await Promise.allSettled([
        dispatch(dashboardThunks.fetchSummary(params)).unwrap(),
        dispatch(dashboardThunks.fetchSeries(params)).unwrap(),
        dispatch(dashboardThunks.fetchKitchen(params)).unwrap(),
      ]);

      const errors = results
        .filter((result): result is PromiseRejectedResult => result.status === "rejected")
        .flatMap((result) => {
          const reason = result.reason;
          return Array.isArray(reason) ? reason : ["Unexpected error"];
        });

      if (errors.length > 0) {
        return rejectWithValue(errors);
      }

      return params;
    }
  ),
};
