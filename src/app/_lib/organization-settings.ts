import {Organization} from "@/app/_types/organization";

export const DEFAULT_LOCALE = "pt-BR";
export const DEFAULT_CURRENCY = "BRL";
export const DEFAULT_TIMEZONE = "America/Sao_Paulo";

export const SUPPORTED_LOCALES = [
  {value: "pt-BR", label: "Português (Brasil)"},
  {value: "en", label: "English"},
  {value: "en-CA", label: "English (Canada)"},
  {value: "es", label: "Español"},
  {value: "fr-CA", label: "Français (Canada)"},
] as const;

export const SUPPORTED_CURRENCIES = [
  {value: "BRL", label: "BRL — Real (Brasil)"},
  {value: "USD", label: "USD — US Dollar"},
  {value: "CAD", label: "CAD — Canadian Dollar"},
  {value: "EUR", label: "EUR — Euro"},
  {value: "CLP", label: "CLP — Peso (Chile)"},
  {value: "MXN", label: "MXN — Peso (México)"},
  {value: "COP", label: "COP — Peso (Colombia)"},
  {value: "ARS", label: "ARS — Peso (Argentina)"},
] as const;

export const SUPPORTED_TIMEZONES = [
  {value: "America/Sao_Paulo", label: "America/Sao_Paulo (Brasília)"},
  {value: "America/Manaus", label: "America/Manaus"},
  {value: "America/Mexico_City", label: "America/Mexico_City"},
  {value: "America/Bogota", label: "America/Bogota"},
  {value: "America/Santiago", label: "America/Santiago"},
  {value: "America/Argentina/Buenos_Aires", label: "America/Argentina/Buenos_Aires"},
  {value: "Europe/Madrid", label: "Europe/Madrid"},
  {value: "America/Toronto", label: "America/Toronto (Eastern)"},
  {value: "America/Vancouver", label: "America/Vancouver (Pacific)"},
  {value: "America/Edmonton", label: "America/Edmonton (Mountain)"},
  {value: "America/Winnipeg", label: "America/Winnipeg (Central)"},
  {value: "America/Halifax", label: "America/Halifax (Atlantic)"},
  {value: "America/St_Johns", label: "America/St_Johns (Newfoundland)"},
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
