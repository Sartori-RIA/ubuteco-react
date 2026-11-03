/**
 * @vitest-environment jsdom
 */
import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import {afterEach, describe, expect, it, vi} from "vitest";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import authReducer from "@/app/_store/features/auth/authSlice";
import {InvoiceReview} from "@/app/inventory/intake/InvoiceReview";
import {adjustStock} from "@/app/_services/inventory";
import {InvoiceLine} from "@/app/_types/intake";

vi.mock("@/app/_services/inventory", () => ({
  adjustStock: vi.fn(),
}));

vi.mock("@/app/_services/intake.service", () => ({
  searchCatalog: vi.fn().mockResolvedValue([]),
}));

const lines: InvoiceLine[] = [
  {
    description: "Lager",
    ean: null,
    quantity: 2,
    unit: "UN",
    unit_cost_cents: 800,
    source: "xml",
    match: {product_type: "beers", id: 1, name: "Lager", confidence: "high"},
  },
  {
    description: "IPA",
    ean: null,
    quantity: 1,
    unit: "UN",
    unit_cost_cents: 900,
    source: "xml",
    match: {product_type: "beers", id: 2, name: "IPA", confidence: "high"},
  },
];

function renderReview() {
  const store = configureStore({reducer: {auth: authReducer}});
  render(
    <Provider store={store}>
      <InvoiceReview initialLines={lines}/>
    </Provider>
  );
}

describe("InvoiceReview", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("applies the successful line and keeps the failed one for another try", async () => {
    vi.mocked(adjustStock).mockImplementation(async (_type, id) => {
      if (id === 2) throw new Error("nope");
      return {quantity_stock: 3};
    });
    renderReview();

    fireEvent.click(screen.getByRole("button", {name: "Aplicar estoque"}));

    expect(await screen.findByText(/Aplicados 1/)).toBeTruthy();
    expect(screen.getByText(/Falharam 1/)).toBeTruthy();
    expect(adjustStock).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole("button", {name: "Aplicar estoque"}));
    await screen.findByText(/Aplicados 0/);
    expect(adjustStock).toHaveBeenCalledTimes(3);
  });
});
