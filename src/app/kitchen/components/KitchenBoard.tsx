"use client";

import {KitchenTicket} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";
import {KitchenTicketCard} from "@/app/kitchen/components/KitchenTicketCard";
import {KITCHEN_COLUMNS} from "@/app/kitchen/_lib/kitchen-columns";

type Props = {
  tickets: KitchenTicket[];
  savingId: number | null;
  showOrderLink?: boolean;
  readOnly?: boolean;
  onStatusChange: (id: number, status: OrderItemStatus) => void;
};

export function KitchenBoard({
  tickets,
  savingId,
  showOrderLink = true,
  readOnly = false,
  onStatusChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {KITCHEN_COLUMNS.map((column) => {
        const columnTickets = tickets.filter((t) => column.statuses.includes(t.status));

        return (
          <section
            key={column.id}
            className="flex min-h-[200px] flex-col rounded-xl border border-gray-200 bg-gray-50/80"
          >
            <header className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">{column.title}</h2>
              <p className="text-xs text-gray-500">{columnTickets.length} items</p>
            </header>
            <div className="flex flex-1 flex-col gap-3 p-3">
              {columnTickets.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-400">No items</p>
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
}
