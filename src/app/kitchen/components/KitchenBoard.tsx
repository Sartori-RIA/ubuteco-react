"use client";

import {memo, useMemo} from "react";
import {KitchenTicket} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";
import {KitchenTicketCard} from "@/app/kitchen/components/KitchenTicketCard";
import {KITCHEN_COLUMNS} from "@/app/kitchen/_lib/kitchen-columns";
import {useTranslations} from "@/app/_hooks/useTranslations";
import type {TranslationKey} from "@/app/_lib/i18n";

type Props = {
  tickets: KitchenTicket[];
  savingId: number | null;
  showOrderLink?: boolean;
  readOnly?: boolean;
  onStatusChange: (id: number, status: OrderItemStatus) => void;
};

export const KitchenBoard = memo(function KitchenBoard({
  tickets,
  savingId,
  showOrderLink = true,
  readOnly = false,
  onStatusChange,
}: Props) {
  const t = useTranslations();
  const columns = useMemo(
    () =>
      KITCHEN_COLUMNS.map((column) => ({
        column,
        columnTickets: tickets.filter((ticket) => column.statuses.includes(ticket.status)),
      })),
    [tickets]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map(({column, columnTickets}) => {
        const titleKey = `kitchen.columns.${column.id}` as TranslationKey;

        return (
          <section
            key={column.id}
            className="flex min-h-[200px] flex-col rounded-xl border border-border bg-surface-muted"
          >
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">{t(titleKey)}</h2>
              <p className="text-xs text-muted">
                {t("kitchen.columnItems", {count: columnTickets.length})}
              </p>
            </header>
            <div className="flex flex-1 flex-col gap-3 p-3">
              {columnTickets.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">{t("kitchen.noItems")}</p>
              ) : (
                columnTickets.map((ticket) => (
                  <KitchenTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    saving={savingId === Number(ticket.id)}
                    showOrderLink={showOrderLink}
                    readOnly={readOnly}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
});
