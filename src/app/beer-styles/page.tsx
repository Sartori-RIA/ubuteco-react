"use client";

import {BeerStylesList} from "@/app/beer-styles/components";
import {Card} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const t = useTranslations();

  return (
    <Card title={t("nav.beerStyles")}>
      <div className="mx-auto max-w-xl space-y-4">
        <BeerStylesList/>
      </div>
    </Card>
  );
}
