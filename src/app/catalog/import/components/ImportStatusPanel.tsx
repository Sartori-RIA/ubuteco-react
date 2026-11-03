import type {TranslateFn} from "@/app/_lib/i18n";
import type {CatalogImport} from "@/app/_services/catalog-import.service";

export function ImportStatusPanel({record, t}: {record: CatalogImport; t: TranslateFn}) {
  return (
    <div>
      <p>{statusCopy(record, t)}</p>
      {record.status === "failed" && record.error_message ? <p>{record.error_message}</p> : null}
      <ul>
        {(record.row_log ?? [])
          .filter((entry) => entry.status === "failed")
          .map((entry) => (
            <li key={entry.line}>
              {t("catalogImport.failedLine", {line: entry.line, cause: entry.errors.join(", ")})}
            </li>
          ))}
      </ul>
    </div>
  );
}

function statusCopy(record: CatalogImport, t: TranslateFn): string {
  if (record.status === "queued") {
    if (!record.estimated_start_at) return t("catalogImport.noEstimate");
    const time = new Date(record.estimated_start_at).toLocaleString();
    return t("catalogImport.estimate", {time});
  }
  if (record.status === "running") {
    return t("catalogImport.running", {processed: record.processed_rows, total: record.total_rows});
  }
  if (record.status === "failed") return t("catalogImport.failed");
  return t("catalogImport.completed", {created: record.created_rows, failed: record.failed_rows});
}

export function importListStatus(record: CatalogImport, t: TranslateFn): string {
  if (record.status === "queued") return t("catalogImport.queued");
  return statusCopy(record, t);
}
