/**
 * @vitest-environment jsdom
 */
import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {createTranslator} from "@/app/_lib/i18n";
import {ImportStatusPanel} from "@/app/catalog/import/components/ImportStatusPanel";
import type {CatalogImport} from "@/app/_services/catalog-import.service";

const t = createTranslator("en");

function record(overrides: Partial<CatalogImport>): CatalogImport {
  return {
    id: 1,
    product_type: "beer",
    status: "queued",
    total_rows: 2,
    created_rows: 1,
    failed_rows: 1,
    processed_rows: 2,
    error_message: null,
    enqueued_at: "2026-11-02T12:00:00Z",
    started_at: null,
    finished_at: null,
    estimated_start_at: null,
    row_log: [],
    ...overrides,
  };
}

describe("ImportStatusPanel", () => {
  it("shows the estimate when the API sends one", () => {
    render(
      <ImportStatusPanel
        t={t}
        record={record({estimated_start_at: "2026-11-02T15:00:00Z"})}
      />
    );
    expect(screen.getByText(/Expected to start around/)).toBeInTheDocument();
  });

  it("says there is no estimate when the API sends null", () => {
    render(<ImportStatusPanel t={t} record={record({estimated_start_at: null})}/>);
    expect(screen.getByText("In queue. There is no start estimate yet.")).toBeInTheDocument();
  });

  it("renders the failed line and its cause", () => {
    render(
      <ImportStatusPanel
        t={t}
        record={record({
          status: "completed",
          row_log: [{line: 3, name: "Second", status: "failed", errors: ["Beer style was not found"]}],
        })}
      />
    );
    expect(screen.getByText("Line 3: Beer style was not found")).toBeInTheDocument();
    expect(screen.getByText(/1 created, 1 failed/)).toBeInTheDocument();
  });
});
