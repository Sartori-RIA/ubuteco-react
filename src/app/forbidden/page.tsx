"use client";

import {useTranslations} from "@/app/_hooks/useTranslations";

export default function ForbiddenPage() {
  const t = useTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">{t("forbidden.title")}</h1>
      <p className="mt-2 text-gray-500">{t("forbidden.message")}</p>
    </div>
  );
}
