/**
 * @vitest-environment jsdom
 */
import {cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {DailyBriefCard} from "@/app/dashboard/components/DailyBriefCard";
import {dashboardService} from "@/app/_services/dashboard.service";
import authReducer from "@/app/_store/features/auth/authSlice";
import dashboardReducer from "@/app/_store/features/dashboard/dashboardSlice";

vi.mock("@/app/_services/dashboard.service", () => ({
  dashboardService: {
    fetchBrief: vi.fn(),
  },
}));

const template = {
  text: "Ontem R$ 10,00.",
  source: "template" as const,
  generated_at: "2026-11-02T12:00:00Z",
};

function renderCard() {
  const testStore = configureStore({reducer: {dashboard: dashboardReducer, auth: authReducer}});
  render(
    <Provider store={testStore}>
      <DailyBriefCard/>
    </Provider>,
  );
}

describe("DailyBriefCard", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.mocked(dashboardService.fetchBrief).mockResolvedValue(template);
  });

  it("shows template text without an AI badge", async () => {
    renderCard();

    expect(await screen.findByText("Ontem R$ 10,00.")).toBeInTheDocument();
    expect(screen.queryByText("Gerado por IA")).not.toBeInTheDocument();
  });

  it("shows the AI badge and disables refresh after one click", async () => {
    vi.mocked(dashboardService.fetchBrief).mockResolvedValue({
      ...template,
      source: "ai",
    });
    renderCard();

    expect(await screen.findByText("Gerado por IA")).toBeInTheDocument();
    const refresh = screen.getByRole("button", {name: "Atualizar"});
    fireEvent.click(refresh);

    await waitFor(() => {
      expect(dashboardService.fetchBrief).toHaveBeenCalledWith(true);
    });
    expect(refresh).toBeDisabled();
  });

  it("hides itself when the brief cannot be loaded", async () => {
    vi.mocked(dashboardService.fetchBrief).mockRejectedValue(new Error("down"));
    renderCard();

    await waitFor(() => {
      expect(screen.queryByText("Resumo do dia")).not.toBeInTheDocument();
    });
  });
});
