export type DashboardSummary = {
  revenue_cents: number;
  orders_count: number;
  open_orders_count: number;
  average_ticket_cents: number;
  currency: string;
  items_by_type: Record<string, number>;
  from: string;
  to: string;
};

export type DashboardSeriesPoint = {
  date: string;
  value: number;
};

export type DashboardSeries = {
  metric: string;
  grain: string;
  currency: string | null;
  from: string;
  to: string;
  points: DashboardSeriesPoint[];
};

export type DashboardFetchParams = {
  from: string;
  to: string;
};

export type DashboardSeriesParams = DashboardFetchParams & {
  grain?: string;
  metric?: string;
};

export type DashboardKitchen = {
  open_dish_count: number;
  avg_prep_seconds: number;
  from: string;
  to: string;
};
