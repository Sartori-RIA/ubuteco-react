import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {KitchenTicket} from "@/app/_types/kitchen-dish";
import {normalizeKitchenTicket} from "@/app/kitchen/_lib/normalize-ticket";
import {kitchenThunks} from "./kitchenThunks";

interface KitchenState {
  tickets: KitchenTicket[];
  loading: boolean;
  savingId: number | null;
  errors?: string[];
  cableConnected: boolean;
}

const initialState: KitchenState = {
  tickets: [],
  loading: false,
  savingId: null,
  errors: undefined,
  cableConnected: false,
};

function upsertTicket(tickets: KitchenTicket[], ticket: KitchenTicket): KitchenTicket[] {
  const id = Number(ticket.id);
  const index = tickets.findIndex((t) => Number(t.id) === id);
  if (index === -1) return [...tickets, ticket];
  const next = [...tickets];
  next[index] = ticket;
  return next;
}

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState,
  reducers: {
    setCableConnected(state, action: PayloadAction<boolean>) {
      state.cableConnected = action.payload;
    },
    ticketReceived(state, action: PayloadAction<KitchenTicket>) {
      state.tickets = upsertTicket(state.tickets, normalizeKitchenTicket(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(kitchenThunks.fetchTickets, {
      pending: (state) => {
        state.loading = state.tickets.length === 0;
        state.errors = undefined;
      },
      fulfilled: (state, action) => {
        state.loading = false;
        state.tickets = action.payload.map(normalizeKitchenTicket);
      },
      rejected: (state, action) => {
        state.loading = false;
        state.errors = action.payload as string[];
      },
    });
    builder.addAsyncThunk(kitchenThunks.updateTicketStatus, {
      pending: (state, action) => {
        state.savingId = action.meta.arg.id;
      },
      fulfilled: (state, action) => {
        state.savingId = null;
        state.tickets = upsertTicket(state.tickets, normalizeKitchenTicket(action.payload));
      },
      rejected: (state, action) => {
        state.savingId = null;
        state.errors = action.payload as string[];
      },
    });
  },
});

export const {setCableConnected, ticketReceived} = kitchenSlice.actions;
export default kitchenSlice.reducer;
