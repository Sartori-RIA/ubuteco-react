"use client";

import {useTranslations} from "@/app/_hooks/useTranslations";

const COLUMN_KEYS = ["awaiting", "cooking", "ready", "done"] as const;

export function KitchenQueueMock() {
  const t = useTranslations();

  return (
    <div className="rounded-2xl border border-white/60 bg-white/95 p-5 shadow-2xl ring-1 ring-amber-200/60 backdrop-blur-sm dark:border-white/10 dark:bg-surface/95 dark:ring-amber-900/40">
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted">
        <span>{t("nav.kitchen")}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"/>
          {t("marketing.hero.mock.live")}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {COLUMN_KEYS.map((key, index) => (
          <div
            key={key}
            className="rounded-xl border border-border/80 bg-gradient-to-b from-surface-muted to-amber-50/50 p-3 dark:to-amber-950/20"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {t(`kitchen.columns.${key}`)}
            </p>
            {index === 0 ? (
              <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/80 p-2 text-xs dark:border-blue-800 dark:from-blue-950/60 dark:to-blue-900/40">
                <p className="font-semibold text-foreground">{t("marketing.hero.mock.ticketName")}</p>
                <p className="text-muted">{t("marketing.hero.mock.ticketMeta")}</p>
              </div>
            ) : index === 1 ? (
              <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100/80 p-2 text-xs dark:border-orange-800 dark:from-orange-950/40 dark:to-amber-950/30">
                <p className="font-semibold text-foreground">{t("marketing.hero.mock.ticketCooking")}</p>
                <p className="text-muted">{t("marketing.hero.mock.ticketCookingMeta")}</p>
              </div>
            ) : (
              <p className="py-4 text-center text-[10px] text-muted">—</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
