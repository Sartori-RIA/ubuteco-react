const ISO_DATE = "en-CA";

/** Last 7 calendar days in the given IANA timezone (inclusive). */
export function defaultDashboardRange(timezone: string): {from: string; to: string} {
  return shiftDashboardRange(timezone, 6);
}

export function shiftDashboardRange(timezone: string, daysBack: number): {from: string; to: string} {
  const to = formatDateInTimezone(new Date(), timezone);
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysBack);
  return {from: formatDateInTimezone(fromDate, timezone), to};
}

export function formatDateInTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat(ISO_DATE, {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isValidDashboardRange(from: string, to: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return false;
  }

  const fromDate = Date.parse(`${from}T00:00:00Z`);
  const toDate = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(fromDate) || Number.isNaN(toDate) || fromDate > toDate) {
    return false;
  }

  const spanDays = Math.round((toDate - fromDate) / (24 * 60 * 60 * 1000));
  return spanDays <= 90;
}
