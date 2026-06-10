import {DEFAULT_LOCALE} from "@/app/_lib/organization-settings";
import privacyEn from "@/app/_lib/legal/privacy/en";
import privacyPtBR from "@/app/_lib/legal/privacy/pt-BR";
import termsEn from "@/app/_lib/legal/terms/en";
import termsPtBR from "@/app/_lib/legal/terms/pt-BR";
import type {LegalDocument, LegalDocumentKind} from "@/app/_lib/legal/types";

const TERMS: Record<string, LegalDocument> = {
  "pt-BR": termsPtBR,
  en: termsEn,
};

const PRIVACY: Record<string, LegalDocument> = {
  "pt-BR": privacyPtBR,
  en: privacyEn,
};

export function getLegalDocument(kind: LegalDocumentKind, locale: string): LegalDocument {
  const catalog = kind === "terms" ? TERMS : PRIVACY;
  return catalog[locale] ?? catalog[DEFAULT_LOCALE] ?? catalog.en;
}
