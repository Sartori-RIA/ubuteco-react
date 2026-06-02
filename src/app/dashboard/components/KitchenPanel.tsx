"use client";

import {Card} from "@/app/_components";
import {formatDurationSeconds} from "@/app/_lib/format-duration";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {DashboardKitchen} from "@/app/_types";

type Props = {
  kitchen: DashboardKitchen | null;
};

export function KitchenPanel({kitchen}: Props) {
  const t = useTranslations();

  return (
    <Card title={t("dashboard.kitchen.title")} className="hover:translate-y-0">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">{t("dashboard.kitchen.openDishes")}</dt>
          <dd className="text-2xl font-semibold text-foreground">
            {kitchen?.open_dish_count?.toLocaleString() ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">{t("dashboard.kitchen.avgPrep")}</dt>
          <dd className="text-2xl font-semibold text-foreground">
            {formatDurationSeconds(kitchen?.avg_prep_seconds)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted">{t("dashboard.kitchen.hint")}</p>
    </Card>
  );
}
