import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {ApiError} from "@/app/_services/api-fetch";
import {assistantService} from "@/app/_services/assistant.service";
import assistantReducer from "@/app/_store/features/assistant/assistantSlice";
import {sendAssistantMessage} from "@/app/_store/features/assistant/assistantThunks";

vi.mock("@/app/_services/assistant.service", () => ({
  assistantService: {
    listConversations: vi.fn(),
    createConversation: vi.fn(),
    getConversation: vi.fn(),
    sendMessage: vi.fn(),
    deleteConversation: vi.fn(),
  },
}));

function store() {
  return configureStore({reducer: {assistant: assistantReducer}});
}

describe("sendAssistantMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores the answer", async () => {
    vi.mocked(assistantService.createConversation).mockResolvedValue({
      id: 4,
      title: null,
      updated_at: "2026-11-02T12:00:00Z",
    });
    vi.mocked(assistantService.sendMessage).mockResolvedValue({
      message: {id: 5, role: "assistant", text: "ok", created_at: "2026-11-02T12:00:00Z"},
    });

    const testStore = store();
    await testStore.dispatch(sendAssistantMessage("oi"));

    expect(testStore.getState().assistant.messages.map((message) => message.text)).toEqual(["oi", "ok"]);
    expect(testStore.getState().assistant.errorCode).toBeNull();
  });

  it("records ai_disabled", async () => {
    vi.mocked(assistantService.createConversation).mockRejectedValue(
      new ApiError(403, {errors: [{code: "ai_disabled", message: "off"}]}),
    );

    const testStore = store();
    await testStore.dispatch(sendAssistantMessage("oi"));

    expect(testStore.getState().assistant.errorCode).toBe("ai_disabled");
  });

  it("records ai_rate_limited", async () => {
    vi.mocked(assistantService.createConversation).mockResolvedValue({
      id: 4,
      title: null,
      updated_at: "2026-11-02T12:00:00Z",
    });
    vi.mocked(assistantService.sendMessage).mockRejectedValue(
      new ApiError(429, {errors: [{code: "ai_rate_limited", message: "slow"}]}),
    );

    const testStore = store();
    await testStore.dispatch(sendAssistantMessage("oi"));

    expect(testStore.getState().assistant.errorCode).toBe("ai_rate_limited");
  });

  it("records ai_unavailable when the request times out", async () => {
    vi.mocked(assistantService.createConversation).mockRejectedValue(new ApiError(503, {}));

    const testStore = store();
    await testStore.dispatch(sendAssistantMessage("oi"));

    expect(testStore.getState().assistant.errorCode).toBe("ai_unavailable");
  });
});
