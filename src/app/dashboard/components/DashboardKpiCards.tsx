"use client";

import {Card} from "@/app/_components";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {DashboardSummary} from "@/app/_types";

type Props = {
  summary: DashboardSummary | null;
};

export function DashboardKpiCards({summary}: Props) {
  const t = useTranslations();
  const {formatMoney} = useMoneyFormat();

  const cards = [
    {
      label: t("dashboard.kpi.revenue"),
      value: formatMoney(summary?.revenue_cents, {currency: summary?.currency}),
    },
    {
      label: t("dashboard.kpi.orders"),
      value: summary?.orders_count?.toLocaleString() ?? "—",
    },
    {
      label: t("dashboard.kpi.averageTicket"),
      value: formatMoney(summary?.average_ticket_cents, {currency: summary?.currency}),
    },
    {
      label: t("dashboard.kpi.openOrders"),
      value: summary?.open_orders_count?.toLocaleString() ?? "—",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} title={card.label} className="hover:translate-y-0">
          <p className="text-3xl font-semibold text-foreground">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
