"use client";

import React from "react";
import {localizeFormErrors} from "@/app/_lib/localize-form-errors";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {useTranslations} from "@/app/_hooks/useTranslations";

export function FormErrors({errors}: { errors: unknown }) {
  const {locale} = useOrganizationSettings();
  const t = useTranslations();
  const messages = localizeFormErrors(errors, locale, t);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <ul className="list-disc list-inside space-y-1">
        {messages.map((error, index) => (<li key={index}>{error}</li>))}
      </ul>
    </div>
  )
}