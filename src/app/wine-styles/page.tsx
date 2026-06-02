"use client";

import {WineStylesList} from "@/app/wine-styles/components";
import {Card} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const t = useTranslations();

  return (
    <Card title={t("nav.wineStyles")}>
      <div className="mx-auto max-w-xl space-y-4">
        <WineStylesList/>
      </div>
    </Card>
  );
}
