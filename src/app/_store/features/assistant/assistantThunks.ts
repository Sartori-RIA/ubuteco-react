import {createAsyncThunk} from "@reduxjs/toolkit";
import {assistantService} from "@/app/_services/assistant.service";
import {ApiError} from "@/app/_services/api-fetch";
import {AiMessage} from "@/app/_types/assistant";

export type AssistantError = {
  code: string;
  messages: string[];
};

function rejectAssistant(err: unknown) {
  if (err instanceof ApiError) {
    return {
      code: err.items[0]?.code ?? (err.status === 503 ? "ai_unavailable" : "error"),
      messages: err.data,
    } satisfies AssistantError;
  }
  return {code: "error", messages: ["Unexpected error"]} satisfies AssistantError;
}

export const loadAssistantConversations = createAsyncThunk(
  "assistant/loadConversations",
  async (_, {rejectWithValue}) => {
    try {
      return await assistantService.listConversations();
    } catch (err) {
      return rejectWithValue(rejectAssistant(err));
    }
  },
);

export const loadAssistantConversation = createAsyncThunk(
  "assistant/loadConversation",
  async (id: number, {rejectWithValue}) => {
    try {
      return await assistantService.getConversation(id);
    } catch (err) {
      return rejectWithValue(rejectAssistant(err));
    }
  },
);

export const sendAssistantMessage = createAsyncThunk<
  {conversationId: number; content: string; reply: AiMessage},
  string,
  {state: {assistant: {activeId: number | null}}; rejectValue: AssistantError}
>(
  "assistant/send",
  async (content, {getState, rejectWithValue}) => {
    try {
      const state = getState() as {assistant: {activeId: number | null}};
      let conversationId = state.assistant.activeId;
      if (!conversationId) {
        const created = await assistantService.createConversation();
        conversationId = created.id;
      }
      const response = await assistantService.sendMessage(conversationId, content);
      return {conversationId, content, reply: response.message};
    } catch (err) {
      return rejectWithValue(rejectAssistant(err));
    }
  },
);

export const deleteAssistantConversation = createAsyncThunk(
  "assistant/delete",
  async (id: number, {rejectWithValue}) => {
    try {
      await assistantService.deleteConversation(id);
      return id;
    } catch (err) {
      return rejectWithValue(rejectAssistant(err));
    }
  },
);
