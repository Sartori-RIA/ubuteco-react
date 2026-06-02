import {DEFAULT_LOCALE} from "@/app/_lib/organization-settings";
import en from "@/app/_lib/i18n/messages/en";
import ptBR from "@/app/_lib/i18n/messages/pt-BR";

const catalogs = {
  en,
  "pt-BR": ptBR,
} as const;

export type SupportedLocale = keyof typeof catalogs;

function getNestedValue(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, source);
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function translate(
  locale: string,
  key: string,
  params?: Record<string, string | number>
): string {
  const catalog = catalogs[locale as SupportedLocale] ?? catalogs[DEFAULT_LOCALE as SupportedLocale];
  const value = getNestedValue(catalog as unknown as Record<string, unknown>, key);
  if (typeof value !== "string") return key;
  return interpolate(value, params);
}

export function createTranslator(locale: string) {
  return (key: string, params?: Record<string, string | number>) => translate(locale, key, params);
}

export type TranslateFn = ReturnType<typeof createTranslator>;
