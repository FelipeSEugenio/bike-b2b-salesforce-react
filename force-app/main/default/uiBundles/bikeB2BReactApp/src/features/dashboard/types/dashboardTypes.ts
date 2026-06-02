export type DashboardKpiId =
  | 'openOrders'
  | 'ordersThisMonth'
  | 'revenueThisMonth'
  | 'avgOrderValue';

export interface DashboardKpi {
  id: DashboardKpiId;
  label: string;
  /**
   * Pre-formatted value for UI. Once we plug GraphQL, we can decide whether
   * formatting belongs server-side, client-side, or both.
   */
  displayValue: string;
  /**
   * Optional "delta vs previous period" display string, e.g. "+8%" or "-2.1%".
   */
  displayDelta?: string;
  /**
   * Optional helper text for context, e.g. "vs last month".
   */
  helperText?: string;
}

export interface DashboardSummary {
  asOfDateISO: string;
  kpis: DashboardKpi[];
}

export type TrendSeriesId = 'orders' | 'revenue';

export interface DashboardTrendPoint {
  dateISO: string;
  value: number;
}

export interface DashboardTrendSeries {
  id: TrendSeriesId;
  label: string;
  points: DashboardTrendPoint[];
}

export interface DashboardTrends {
  range: {
    startDateISO: string;
    endDateISO: string;
    granularity: 'day' | 'week' | 'month';
  };
  series: DashboardTrendSeries[];
}

export interface DashboardOrdersOverview {
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  mostRecent: Array<{
    orderId: string;
    orderName: string;
    createdDateISO: string;
    status: string;
    displayTotal?: string;
  }>;
}

