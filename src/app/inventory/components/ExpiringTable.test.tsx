/**
 * @vitest-environment jsdom
 */
import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {ExpiringTable} from "@/app/inventory/components/ExpiringTable";
import {createTranslator} from "@/app/_lib/i18n";
import type {ExpiringProductItem} from "@/app/_services/inventory";

vi.mock("next/link", () => ({
  default: ({href, children}: {href: string; children: React.ReactNode}) => <a href={href}>{children}</a>,
}));

const t = createTranslator("en");

const items: ExpiringProductItem[] = [
  {
    product_type: "beers",
    id: 1,
    name: "Old IPA",
    valid_until: "2026-11-01T00:00:00Z",
    days_remaining: -1,
    status: "expired",
  },
  {
    product_type: "foods",
    id: 4,
    name: "Bread",
    valid_until: "2026-11-05T00:00:00Z",
    days_remaining: 3,
    status: "expiring",
  },
];

describe("ExpiringTable", () => {
  it("renders names, status chips, and edit links", () => {
    render(<ExpiringTable items={items} t={t}/>);

    expect(screen.getByText("Old IPA")).toBeInTheDocument();
    expect(screen.getByText("Bread")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
    expect(screen.getByText("Expiring")).toBeInTheDocument();
    expect(screen.getAllByRole("link", {name: "Edit"})[0]).toHaveAttribute("href", "/beers/1/edit");
    expect(screen.getAllByRole("link", {name: "Edit"})[1]).toHaveAttribute("href", "/foods/4/edit");
  });

  it("renders the empty state", () => {
    render(<ExpiringTable items={[]} t={t}/>);

    expect(screen.getByText("No products are expiring or expired.")).toBeInTheDocument();
  });
});
