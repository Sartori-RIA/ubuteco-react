"use client";

import {Card} from "@/app/_components";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {DashboardSeries} from "@/app/_types";

type Props = {
  series: DashboardSeries | null;
};

export function RevenueChart({series}: Props) {
  const t = useTranslations();
  const {formatMoney, formatDate} = useMoneyFormat();
  const points = series?.points ?? [];
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  if (points.length === 0) {
    return (
      <Card title={t("dashboard.chart.revenueTitle")} className="hover:translate-y-0">
        <p className="py-8 text-center text-sm text-muted">{t("dashboard.chart.empty")}</p>
      </Card>
    );
  }

  return (
    <Card title={t("dashboard.chart.revenueTitle")} className="hover:translate-y-0">
      <div className="flex h-64 items-end gap-2 border-b border-border pb-2">
        {points.map((point) => {
          const height = `${Math.max((point.value / maxValue) * 100, point.value > 0 ? 8 : 0)}%`;
          return (
            <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-muted">
                {point.value > 0
                  ? formatMoney(point.value, {currency: series?.currency ?? undefined})
                  : ""}
              </span>
              <div className="flex h-40 w-full items-end">
                <div
                  className="w-full rounded-t-md bg-blue-500/80 dark:bg-blue-400/70"
                  style={{height}}
                  title={`${formatDate(point.date, {dateStyle: "short"})}: ${formatMoney(point.value, {currency: series?.currency ?? undefined})}`}
                />
              </div>
              <span className="truncate text-[10px] text-muted">
                {formatDate(point.date, {dateStyle: "short"})}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
