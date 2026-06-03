import {DashboardFetchParams, DashboardKitchen, DashboardSeries, DashboardSeriesParams, DashboardSummary} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

function buildQuery(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) qs.set(key, value);
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
}

async function fetchSummary(params: DashboardFetchParams): Promise<DashboardSummary> {
  const query = buildQuery({from: params.from, to: params.to});
  return await apiFetch<DashboardSummary>(`v1/dashboard/summary${query}`);
}

async function fetchSeries(params: DashboardSeriesParams): Promise<DashboardSeries> {
  const query = buildQuery({
    from: params.from,
    to: params.to,
    grain: params.grain ?? "day",
    metric: params.metric ?? "revenue",
  });
  return await apiFetch<DashboardSeries>(`v1/dashboard/series${query}`);
}

async function fetchKitchen(params: DashboardFetchParams): Promise<DashboardKitchen> {
  const query = buildQuery({from: params.from, to: params.to});
  return await apiFetch<DashboardKitchen>(`v1/dashboard/kitchen${query}`);
}

export const dashboardService = {
  fetchSummary,
  fetchSeries,
  fetchKitchen,
};
