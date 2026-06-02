/**
 * Whether a debounced quantity input should persist to the server.
 * Only applies when the user edited the field (see QuantityInput userEditedRef).
 */
export function shouldPersistDebouncedQuantity(
  localQty: number,
  debouncedQty: number,
  serverQty: number
): boolean {
  if (debouncedQty < 1 || debouncedQty === serverQty) return false;
  if (localQty !== debouncedQty) return false;
  return localQty !== serverQty;
}
