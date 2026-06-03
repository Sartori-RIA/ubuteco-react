import {DashboardKitchen, DashboardSeries, DashboardSummary} from "@/app/_types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {defaultDashboardRange} from "@/app/_lib/dashboard-date-range";
import {DEFAULT_TIMEZONE} from "@/app/_lib/organization-settings";
import {dashboardThunks} from "./dashboardThunks";

type DashboardState = {
  summary: DashboardSummary | null;
  series: DashboardSeries | null;
  kitchen: DashboardKitchen | null;
  from: string;
  to: string;
  loading: boolean;
  errors?: string[];
};

const initialRange = defaultDashboardRange(DEFAULT_TIMEZONE);

const initialState: DashboardState = {
  summary: null,
  series: null,
  kitchen: null,
  from: initialRange.from,
  to: initialRange.to,
  loading: false,
  errors: undefined,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDateRange(state, action: PayloadAction<{from: string; to: string}>) {
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
    resetDateRange(state, action: PayloadAction<string | undefined>) {
      const range = defaultDashboardRange(action.payload ?? DEFAULT_TIMEZONE);
      state.from = range.from;
      state.to = range.to;
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(dashboardThunks.fetchAll, {
      pending: (state) => {
        state.loading = true;
        state.errors = undefined;
      },
      fulfilled: (state) => {
        state.loading = false;
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(dashboardThunks.fetchSummary, {
      fulfilled: (state, action) => {
        state.summary = action.payload as DashboardSummary;
      },
    });
    builder.addAsyncThunk(dashboardThunks.fetchSeries, {
      fulfilled: (state, action) => {
        state.series = action.payload as DashboardSeries;
      },
    });
    builder.addAsyncThunk(dashboardThunks.fetchKitchen, {
      fulfilled: (state, action) => {
        state.kitchen = action.payload as DashboardKitchen;
      },
    });
  },
});

export const {setDateRange, resetDateRange} = dashboardSlice.actions;
export default dashboardSlice.reducer;
