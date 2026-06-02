import {Organization} from "@/app/_types/organization";

export const DEFAULT_LOCALE = "pt-BR";
export const DEFAULT_CURRENCY = "BRL";
export const DEFAULT_TIMEZONE = "America/Sao_Paulo";

export const SUPPORTED_LOCALES = [
  {value: "pt-BR", label: "Português (Brasil)"},
  {value: "en", label: "English"},
] as const;

export const SUPPORTED_CURRENCIES = [
  {value: "BRL", label: "BRL — Brazilian Real"},
  {value: "USD", label: "USD — US Dollar"},
  {value: "EUR", label: "EUR — Euro"},
] as const;

export const SUPPORTED_TIMEZONES = [
  {value: "America/Sao_Paulo", label: "America/Sao_Paulo (Brasília)"},
  {value: "America/Manaus", label: "America/Manaus"},
  {value: "America/New_York", label: "America/New_York"},
  {value: "Europe/Lisbon", label: "Europe/Lisbon"},
  {value: "UTC", label: "UTC"},
] as const;

export type OrganizationSettings = {
  locale: string;
  defaultCurrency: string;
  timezone: string;
};

export function resolveOrganizationSettings(
  organization: Organization | null | undefined
): OrganizationSettings {
  return {
    locale: organization?.locale ?? DEFAULT_LOCALE,
    defaultCurrency: organization?.default_currency ?? DEFAULT_CURRENCY,
    timezone: organization?.timezone ?? DEFAULT_TIMEZONE,
  };
}
