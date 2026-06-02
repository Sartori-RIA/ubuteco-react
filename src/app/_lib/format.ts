import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  OrganizationSettings,
} from "@/app/_lib/organization-settings";

export type FormatMoneyOptions = Partial<OrganizationSettings> & {
  currency?: string;
  locale?: string;
};

export function formatMoney(
  cents: number | null | undefined,
  options: FormatMoneyOptions = {}
): string {
  if (cents == null || Number.isNaN(cents)) return "—";

  const currency = options.currency ?? options.defaultCurrency ?? DEFAULT_CURRENCY;
  const locale = options.locale ?? DEFAULT_LOCALE;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatAmount(
  amount: number,
  options: FormatMoneyOptions = {}
): string {
  if (Number.isNaN(amount)) return "—";

  const currency = options.currency ?? options.defaultCurrency ?? DEFAULT_CURRENCY;
  const locale = options.locale ?? DEFAULT_LOCALE;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export type FormatDateOptions = Partial<OrganizationSettings> & {
  locale?: string;
  timezone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

export function formatDate(
  value: string | number | Date | null | undefined,
  options: FormatDateOptions = {}
): string {
  if (value == null || value === "") return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const locale = options.locale ?? DEFAULT_LOCALE;
  const timezone = options.timezone ?? DEFAULT_TIMEZONE;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle,
    timeZone: timezone,
  }).format(date);
}
