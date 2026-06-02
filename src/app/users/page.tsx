"use client";

import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const t = useTranslations();
  return <h1>{t("catalog.usersPlaceholder")}</h1>;
}
