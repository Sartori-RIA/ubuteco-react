import type {TranslateFn, TranslationKey} from "@/app/_lib/i18n";
import {extractApiErrorItems} from "@/app/_lib/api-errors";

const API_ERROR_KEYS: Record<string, TranslationKey> = {
  not_stockable: "api.errors.notStockable",
  adjustment_zero: "api.errors.adjustmentZero",
  insufficient_stock: "api.errors.insufficientStock",
  kitchen_closed: "api.errors.kitchenClosed",
  search_unavailable: "api.errors.searchUnavailable",
  delete_restriction: "api.errors.deleteRestriction",
  account_deletion_forbidden: "api.errors.accountDeletionForbidden",
  role_assignment_forbidden: "api.errors.roleAssignmentForbidden",
};

/** Prefer client i18n by API error code; fall back to server message. */
export function resolveApiErrorMessages(errors: unknown, t: TranslateFn): string[] {
  const items = extractApiErrorItems(errors);

  if (items.length === 0) {
    if (typeof errors === "string" && errors.length > 0) return [errors];
    return [];
  }

  return items
    .map((item) => {
      const code = item.code ?? "";
      const key = API_ERROR_KEYS[code];
      if (key) return t(key);
      if (typeof item.message === "string" && item.message.length > 0) return item.message;
      return t("api.errors.generic");
    })
    .filter((message) => message.length > 0);
}
