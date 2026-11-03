/**
 * @vitest-environment jsdom
 */
import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import {afterEach, describe, expect, it, vi} from "vitest";
import {Provider} from "react-redux";
import {ToastProvider} from "@/app/_components/Toast/ToastProvider";
import {createTranslator} from "@/app/_lib/i18n";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {store} from "@/app/_store";
import {User} from "@/app/_types";
import {RestockSuggestion} from "@/app/_services/inventory";
import {RestockSuggestionsTable} from "@/app/inventory/components/RestockSuggestionsTable";

const t = createTranslator("en");

const items: RestockSuggestion[] = [
  {
    product_type: "beers",
    id: 9,
    name: "House lager",
    quantity_stock: 4,
    avg_daily: 6,
    days_of_cover: 0.7,
    suggested_quantity: 38,
    confidence: "ok",
  },
  {
    product_type: "foods",
    id: 3,
    name: "New bread",
    quantity_stock: 2,
    avg_daily: 0,
    days_of_cover: null,
    suggested_quantity: null,
    confidence: "low",
  },
];

function renderTable(showExplain = false) {
  const onCoverDaysChange = vi.fn();
  const onExplainChange = vi.fn();
  store.dispatch(setAuthenticatedUser({
    id: 1,
    name: "Admin",
    email: "admin@email.com",
    role: {id: 1, name: "ADMIN"},
    organization: {id: 7, name: "Bar", ai_enabled: showExplain},
  } as User));

  render(
    <Provider store={store}>
      <ToastProvider>
        <RestockSuggestionsTable
          items={items}
          coverDays={7}
          onCoverDaysChange={onCoverDaysChange}
          showExplain={showExplain}
          explain={false}
          onExplainChange={onExplainChange}
          onAdjusted={vi.fn()}
          t={t}
        />
      </ToastProvider>
    </Provider>,
  );

  return {onCoverDaysChange, onExplainChange};
}

describe("RestockSuggestionsTable", () => {
  afterEach(() => cleanup());

  it("shows a buy quantity and greys out a product without history", () => {
    renderTable();

    expect(screen.getByText("House lager")).toBeInTheDocument();
    expect(screen.getByText("38")).toBeInTheDocument();
    expect(screen.getByText("Not enough history")).toBeInTheDocument();
    expect(screen.queryByRole("switch", {name: "Explain"})).not.toBeInTheDocument();
  });

  it("refetches when the cover window changes and prefills the adjustment", () => {
    const {onCoverDaysChange} = renderTable(true);

    fireEvent.change(screen.getByRole("combobox", {name: "Cover"}), {target: {value: "14"}});
    expect(onCoverDaysChange).toHaveBeenCalledWith(14);

    fireEvent.click(screen.getByRole("button", {name: "Adjust stock"}));
    expect(screen.getByDisplayValue("38")).toBeInTheDocument();
    expect(screen.getByDisplayValue("delivery")).toBeInTheDocument();
    expect(screen.getByRole("switch", {name: "Explain"})).toBeInTheDocument();
  });
});
