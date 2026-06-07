export type ApiErrorItem = {
  code?: string;
  field?: string;
  message?: string;
};

function isApiErrorItem(value: unknown): value is ApiErrorItem {
  return typeof value === "object" && value !== null;
}

export function extractApiErrorItems(errors: unknown): ApiErrorItem[] {
  if (errors == null) return [];

  if (Array.isArray(errors)) {
    return errors.filter(isApiErrorItem);
  }

  if (typeof errors === "object" && Array.isArray((errors as { errors?: unknown }).errors)) {
    return extractApiErrorItems((errors as { errors: unknown }).errors);
  }

  return [];
}
