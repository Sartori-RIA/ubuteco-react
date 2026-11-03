import {beforeEach, describe, expect, it} from "vitest";
import {http, HttpResponse} from "msw";
import {server} from "@/test/msw/server";
import {apiUrl} from "@/test/msw/handlers";
import {
  createImport,
  ImportFileError,
  ImportInProgressError,
  MAX_IMPORT_BYTES,
  shouldPoll,
} from "@/app/_services/catalog-import.service";

describe("catalog import service", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("rejects a file over 1 MB before the request", async () => {
    let called = false;
    server.use(http.post(apiUrl("v1/catalog/imports"), () => {
      called = true;
      return HttpResponse.json({id: 1});
    }));

    const file = new File([new Uint8Array(MAX_IMPORT_BYTES + 1)], "beers.csv", {type: "text/csv"});
    await expect(createImport(file, "beer")).rejects.toBeInstanceOf(ImportFileError);
    expect(called).toBe(false);
  });

  it("posts the file without a dry-run flag and returns the queued import", async () => {
    server.use(http.post(apiUrl("v1/catalog/imports"), async ({request}) => {
      const form = await request.formData();
      expect(form.get("dry_run")).toBeNull();
      expect(form.get("product_type")).toBe("beer");
      return HttpResponse.json({
        id: 4,
        status: "queued",
        product_type: "beer",
        total_rows: 1,
        created_rows: 0,
        failed_rows: 0,
        processed_rows: 0,
        error_message: null,
        enqueued_at: "2026-11-02T12:00:00Z",
        started_at: null,
        finished_at: null,
        estimated_start_at: null,
      });
    }));

    const created = await createImport(new File(["name,price\nA,1\n"], "beers.csv", {type: "text/csv"}), "beer");
    expect(created.status).toBe("queued");
    expect(created.id).toBe(4);
  });

  it("exposes the running import when the API returns 409", async () => {
    server.use(http.post(apiUrl("v1/catalog/imports"), () => {
      return HttpResponse.json({
        id: 9,
        status: "running",
        errors: [{code: "import_in_progress", message: "busy"}],
      }, {status: 409});
    }));

    await expect(
      createImport(new File(["name,price\nA,1\n"], "beers.csv"), "beer")
    ).rejects.toMatchObject({id: 9});
    await expect(
      createImport(new File(["name,price\nA,1\n"], "beers.csv"), "beer")
    ).rejects.toBeInstanceOf(ImportInProgressError);
  });

  it("returns the API invalid_csv error", async () => {
    server.use(http.post(apiUrl("v1/catalog/imports"), () => {
      return HttpResponse.json({
        errors: [{code: "invalid_csv", message: "Unknown column"}],
      }, {status: 422});
    }));

    await expect(
      createImport(new File(["nome,preco\nA,1\n"], "beers.csv"), "beer")
    ).rejects.toMatchObject({status: 422});
  });

  it("stops polling after the import finishes", () => {
    expect(shouldPoll("queued")).toBe(true);
    expect(shouldPoll("running")).toBe(true);
    expect(shouldPoll("completed")).toBe(false);
    expect(shouldPoll("failed")).toBe(false);
  });
});
