"use client";

import {useEffect, useState} from "react";
import {Card, Loading} from "@/app/_components";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {dashboardThunks} from "@/app/_store/features/dashboard/dashboardThunks";

const REFRESH_COOLDOWN_MS = 60_000;

export function DailyBriefCard() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const {formatDate} = useMoneyFormat();
  const brief = useAppSelector((state) => state.dashboard.brief);
  const loading = useAppSelector((state) => state.dashboard.briefLoading);
  const failed = useAppSelector((state) => state.dashboard.briefFailed);
  const [coolingDown, setCoolingDown] = useState(false);

  useEffect(() => {
    void dispatch(dashboardThunks.fetchBrief(false));
  }, [dispatch]);

  useEffect(() => {
    if (!coolingDown) return undefined;
    const timer = window.setTimeout(() => setCoolingDown(false), REFRESH_COOLDOWN_MS);
    return () => window.clearTimeout(timer);
  }, [coolingDown]);

  if (failed) return null;
  if (loading && !brief) {
    return (
      <Card title={t("dashboard.brief.title")}>
        <Loading/>
      </Card>
    );
  }
  if (!brief) return null;

  return (
    <Card title={t("dashboard.brief.title")}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{t("dashboard.brief.subtitle")}</p>
        <button
          type="button"
          disabled={coolingDown || loading}
          onClick={() => {
            setCoolingDown(true);
            void dispatch(dashboardThunks.fetchBrief(true));
          }}
          className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:underline disabled:opacity-50 dark:text-blue-400"
        >
          {t("dashboard.brief.refresh")}
        </button>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm text-foreground">{brief.text}</p>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        {brief.source === "ai" && (
          <span className="rounded bg-gray-200 px-1.5 py-0.5 uppercase dark:bg-gray-700">
            {t("dashboard.brief.aiBadge")}
          </span>
        )}
        <span>{t("dashboard.brief.generatedAt", {time: formatDate(brief.generated_at)})}</span>
      </p>
    </Card>
  );
}
