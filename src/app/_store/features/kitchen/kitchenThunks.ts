import {createAsyncThunk} from "@reduxjs/toolkit";
import {kitchenService} from "@/app/_services/kitchen.service";
import {OrderItemStatus} from "@/app/_types/order";
import {ApiError} from "@/app/_services/api-fetch";

export const fetchTickets = createAsyncThunk(
  "kitchen/fetchTickets",
  async (_, {rejectWithValue}) => {
    try {
      return await kitchenService.list();
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not load kitchen queue"]);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "kitchen/updateTicketStatus",
  async ({id, status}: {id: number; status: OrderItemStatus}, {rejectWithValue}) => {
    try {
      return await kitchenService.updateStatus(id, status);
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.data);
      }
      return rejectWithValue(["Could not update status"]);
    }
  }
);

export const kitchenThunks = {
  fetchTickets,
  updateTicketStatus,
};
