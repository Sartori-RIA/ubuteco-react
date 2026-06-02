"use client";

import {useEffect} from "react";
import dynamic from "next/dynamic";
import {FormErrors, Loading} from "@/app/_components";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {isValidDashboardRange} from "@/app/_lib/dashboard-date-range";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {resetDateRange, setDateRange} from "@/app/_store/features/dashboard/dashboardSlice";
import {dashboardThunks} from "@/app/_store/features/dashboard/dashboardThunks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {
  DashboardDateRange,
  DashboardKpiCards,
  ItemsByTypePanel,
  KitchenPanel,
  RevenueChart,
} from "@/app/dashboard/components";

function OrganizationDashboard() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const {timezone} = useMoneyFormat();
  const {summary, series, kitchen, from, to, loading, errors} = useAppSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(resetDateRange(timezone));
  }, [dispatch, timezone]);

  useEffect(() => {
    if (!isValidDashboardRange(from, to)) return;
    dispatch(dashboardThunks.fetchAll({from, to}));
  }, [dispatch, from, to]);

  const showLoading = loading && !summary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("dashboard.subtitle")}</p>
      </div>

      <DashboardDateRange
        from={from}
        to={to}
        onChange={(next) => dispatch(setDateRange(next))}
      />

      <FormErrors errors={errors}/>

      {showLoading ? (
        <Loading/>
      ) : (
        <>
          <DashboardKpiCards summary={summary}/>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-6">
              <RevenueChart series={series}/>
              <KitchenPanel kitchen={kitchen}/>
            </div>
            <ItemsByTypePanel itemsByType={summary?.items_by_type}/>
          </div>
        </>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(OrganizationDashboard), {ssr: false});
