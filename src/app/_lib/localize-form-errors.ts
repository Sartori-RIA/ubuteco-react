import type {TranslateFn, TranslationKey} from "@/app/_lib/i18n";
import {extractApiErrorItems} from "@/app/_lib/api-errors";
import {normalizeErrors} from "@/app/_lib/normalize-errors";
import {formatOrderItemStatus} from "@/app/orders/_lib/order-display";

const API_ERROR_KEYS: Record<string, TranslationKey> = {
  not_stockable: "api.errors.notStockable",
  adjustment_zero: "api.errors.adjustmentZero",
  insufficient_stock: "api.errors.insufficientStock",
  kitchen_closed: "api.errors.kitchenClosed",
  search_unavailable: "api.errors.searchUnavailable",
  delete_restriction: "api.errors.deleteRestriction",
};

const STATUS_TRANSITION_PATTERNS = [
  /cannot transition from (\w+) to (\w+)/i,
  /não é possível alterar de (\w+) para (\w+)/i,
  /no se puede cambiar de (\w+) a (\w+)/i,
];

function parseStatusTransition(message: string): {from: string; to: string} | null {
  for (const pattern of STATUS_TRANSITION_PATTERNS) {
    const match = message.match(pattern);
    if (match) return {from: match[1], to: match[2]};
  }
  return null;
}

function localizeMessage(message: string, locale: string, t: TranslateFn): string {
  const transition = parseStatusTransition(message);
  if (!transition) return message;

  return t("api.errors.invalidTransition", {
    from: formatOrderItemStatus(transition.from, locale),
    to: formatOrderItemStatus(transition.to, locale),
  });
}

/** Client-side labels for API validation and inventory error payloads. */
export function localizeFormErrors(errors: unknown, locale: string, t: TranslateFn): string[] {
  const items = extractApiErrorItems(errors);
  if (items.length > 0) {
    return items
      .map((item) => {
        const code = item.code ?? "";
        const key = API_ERROR_KEYS[code];
        if (key) return t(key);
        const message = typeof item.message === "string" ? item.message : "";
        if (message.length > 0) return localizeMessage(message, locale, t);
        return t("api.errors.generic");
      })
      .filter((message) => message.length > 0);
  }

  return normalizeErrors(errors).map((message) => localizeMessage(message, locale, t));
}
