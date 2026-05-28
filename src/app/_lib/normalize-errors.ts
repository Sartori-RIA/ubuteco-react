export function normalizeErrors(errors: unknown): string[] {
  if (errors == null) return [];

  if (Array.isArray(errors)) {
    return errors.flatMap(normalizeErrors);
  }

  if (typeof errors === "string") {
    return errors.length > 0 ? [errors] : [];
  }

  if (typeof errors === "object") {
    return Object.values(errors).flatMap(normalizeErrors);
  }

  return [String(errors)];
}
