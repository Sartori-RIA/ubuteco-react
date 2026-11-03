/**
 * @vitest-environment jsdom
 */
import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {ApiError} from "@/app/_services/api-fetch";
import {assistantService} from "@/app/_services/assistant.service";
import {AssistantDrawer} from "@/app/_components/assistant/AssistantDrawer";
import assistantReducer, {AssistantState} from "@/app/_store/features/assistant/assistantSlice";
import authReducer from "@/app/_store/features/auth/authSlice";
import {MessageList} from "@/app/_components/assistant/MessageList";

vi.mock("@/app/_services/assistant.service", () => ({
  assistantService: {
    listConversations: vi.fn(),
    createConversation: vi.fn(),
    getConversation: vi.fn(),
    sendMessage: vi.fn(),
    deleteConversation: vi.fn(),
  },
}));

const openState: AssistantState = {
  open: true,
  conversations: [],
  activeId: null,
  messages: [],
  sending: false,
  errorCode: null,
};

function renderDrawer(assistant: AssistantState = openState) {
  const testStore = configureStore({
    reducer: {assistant: assistantReducer, auth: authReducer},
    preloadedState: {assistant},
  });
  render(
    <Provider store={testStore}>
      <AssistantDrawer/>
    </Provider>,
  );
}

describe("AssistantDrawer", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.mocked(assistantService.listConversations).mockResolvedValue([]);
  });

  it("does not render raw HTML from the model", () => {
    render(
      <MessageList
        messages={[{
          id: 1,
          role: "assistant",
          text: "<script>alert(1)</script>",
          created_at: "2026-11-02T12:00:00Z",
        }]}
      />,
    );

    expect(document.querySelector("script")).toBeNull();
    expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
  });

  it("keeps the typed question when the send fails", async () => {
    vi.mocked(assistantService.createConversation).mockResolvedValue({
      id: 4,
      title: null,
      updated_at: "2026-11-02T12:00:00Z",
    });
    vi.mocked(assistantService.sendMessage).mockRejectedValue(
      new ApiError(429, {errors: [{code: "ai_rate_limited", message: "slow"}]}),
    );
    renderDrawer();

    fireEvent.change(screen.getByLabelText("Faça uma pergunta"), {target: {value: "Quanto vendi?"}});
    fireEvent.click(screen.getByRole("button", {name: "Enviar"}));

    expect(await screen.findByText("Perguntas demais. Espere um pouco e tente de novo.")).toBeInTheDocument();
    expect(screen.getByLabelText("Faça uma pergunta")).toHaveValue("Quanto vendi?");
  });
});
