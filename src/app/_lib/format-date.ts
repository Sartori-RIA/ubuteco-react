const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function parseDateParts(value: string | Date): { year: string; month: string; day: string } | null {
  const iso = typeof value === "string" ? value : value.toISOString();
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return {year: match[1], month: match[2], day: match[3]};
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const parts = parseDateParts(value);
  if (!parts) return "—";
  const monthIndex = Number(parts.month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return "—";
  return `${parts.day} ${MONTHS_SHORT[monthIndex]} ${parts.year}`;
}

export function formatDateLong(value?: string | Date | null): string {
  if (!value) return "—";
  const parts = parseDateParts(value);
  if (!parts) return "—";
  const monthIndex = Number(parts.month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return "—";
  return `${MONTHS_LONG[monthIndex]} ${parts.day}, ${parts.year}`;
}

/** For `<input type="date" />` — calendar day from API string, no timezone shift. */
export function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "";
}
