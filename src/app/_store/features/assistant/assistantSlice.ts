import {createSlice} from "@reduxjs/toolkit";
import {AiConversation, AiMessage} from "@/app/_types/assistant";
import {
  deleteAssistantConversation,
  loadAssistantConversation,
  loadAssistantConversations,
  sendAssistantMessage,
} from "@/app/_store/features/assistant/assistantThunks";

export type AssistantState = {
  open: boolean;
  conversations: AiConversation[];
  activeId: number | null;
  messages: AiMessage[];
  sending: boolean;
  errorCode: string | null;
};

const initialState: AssistantState = {
  open: false,
  conversations: [],
  activeId: null,
  messages: [],
  sending: false,
  errorCode: null,
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    setAssistantOpen(state, action: {payload: boolean}) {
      state.open = action.payload;
      if (!action.payload) state.errorCode = null;
    },
    resetAssistant() {
      return initialState;
    },
    startNewConversation(state) {
      state.activeId = null;
      state.messages = [];
      state.errorCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAssistantConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(loadAssistantConversation.fulfilled, (state, action) => {
        state.activeId = action.payload.id;
        state.messages = action.payload.messages;
        state.errorCode = null;
      })
      .addCase(sendAssistantMessage.pending, (state) => {
        state.sending = true;
        state.errorCode = null;
      })
      .addCase(sendAssistantMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.activeId = action.payload.conversationId;
        state.messages.push(
          {
            id: -Date.now(),
            role: "user",
            text: action.payload.content,
            created_at: action.payload.reply.created_at,
          },
          action.payload.reply,
        );
        const existing = state.conversations.find((item) => item.id === action.payload.conversationId);
        if (!existing) {
          state.conversations.unshift({
            id: action.payload.conversationId,
            title: action.payload.content.slice(0, 80),
            updated_at: action.payload.reply.created_at,
          });
        }
      })
      .addCase(sendAssistantMessage.rejected, (state, action) => {
        state.sending = false;
        state.errorCode = action.payload?.code ?? "error";
      })
      .addCase(deleteAssistantConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter((item) => item.id !== action.payload);
        if (state.activeId === action.payload) {
          state.activeId = null;
          state.messages = [];
        }
      });
  },
});

export const {setAssistantOpen, resetAssistant, startNewConversation} = assistantSlice.actions;
export default assistantSlice.reducer;
