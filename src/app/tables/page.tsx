"use client";

import {TablesList} from "@/app/tables/components";
import {Card} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const t = useTranslations();

  return (
    <Card title={t("nav.tables")}>
      <div className="mx-auto max-w-xl space-y-4">
        <TablesList/>
      </div>
    </Card>
  );
}
