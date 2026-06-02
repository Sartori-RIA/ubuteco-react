"use client";

import {Card, Input, Label} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  from: string;
  to: string;
  onChange: (next: {from: string; to: string}) => void;
};

export function DashboardDateRange({from, to, onChange}: Props) {
  const t = useTranslations();

  return (
    <Card title={t("dashboard.dateRange.title")} className="hover:translate-y-0">
      <div className="grid gap-4 sm:grid-cols-2">
        <Label label={t("dashboard.dateRange.from")}>
          <Input
            type="date"
            name="from"
            value={from}
            onChange={(event) => onChange({from: event.target.value, to})}
            className="!pl-4"
          />
        </Label>
        <Label label={t("dashboard.dateRange.to")}>
          <Input
            type="date"
            name="to"
            value={to}
            onChange={(event) => onChange({from, to: event.target.value})}
            className="!pl-4"
          />
        </Label>
      </div>
      <p className="mt-3 text-xs text-muted">{t("dashboard.dateRange.hint")}</p>
    </Card>
  );
}
