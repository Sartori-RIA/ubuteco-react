export const CURRENT_USER_FETCH_TTL_MS = 30_000;

export function isCurrentUserFetchFresh(fetchedAt: number | null): boolean {
  if (fetchedAt == null) return false;
  return Date.now() - fetchedAt < CURRENT_USER_FETCH_TTL_MS;
}
