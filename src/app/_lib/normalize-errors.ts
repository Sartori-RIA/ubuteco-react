type ApiErrorItem = {
  code?: string;
  field?: string;
  message?: string;
};

function isApiErrorItem(value: unknown): value is ApiErrorItem {
  return typeof value === "object" && value !== null && "message" in value;
}

function messagesFromApiErrorItems(items: ApiErrorItem[]): string[] {
  return items
    .map((item) => item.message)
    .filter((message): message is string => typeof message === "string" && message.length > 0);
}

export function normalizeErrors(errors: unknown): string[] {
  if (errors == null) return [];

  if (typeof errors === "string") {
    return errors.length > 0 ? [errors] : [];
  }

  if (Array.isArray(errors)) {
    if (errors.length === 0) return [];

    if (errors.every((item) => typeof item === "string")) {
      return errors.filter((item): item is string => item.length > 0);
    }

    if (errors.every(isApiErrorItem)) {
      return messagesFromApiErrorItems(errors);
    }

    return errors.flatMap(normalizeErrors);
  }

  if (typeof errors === "object") {
    const record = errors as Record<string, unknown>;

    if (Array.isArray(record.errors)) {
      return normalizeErrors(record.errors);
    }

    return Object.values(record).flatMap(normalizeErrors);
  }

  return [String(errors)];
}
