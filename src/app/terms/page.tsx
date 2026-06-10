"use client";

import {LegalPageLayout} from "@/app/_components/marketing/LegalPageLayout";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {getLegalDocument} from "@/app/_lib/legal";

export default function TermsPage() {
  const {locale} = useOrganizationSettings();
  const document = getLegalDocument("terms", locale);

  return <LegalPageLayout content={document}/>;
}
