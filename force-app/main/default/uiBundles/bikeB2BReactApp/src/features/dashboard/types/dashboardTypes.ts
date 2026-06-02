export type ISODate = string;
export type ISODateTime = string;
export type Money = number;
export type DisplayMoney = string;

export type DashboardDateRangePreset = 'last7' | 'last30' | 'mtd' | 'custom';

export interface DashboardDateRange {
  startDate: ISODate;
  endDate: ISODate;
  preset?: DashboardDateRangePreset;
}

export interface DashboardFilters {
  dateRange: DashboardDateRange;
  accountId?: string | null;
  orderStatuses?: string[];
}

export type DashboardSummaryKpiId =
  | 'totalBikes'
  | 'activeBikes'
  | 'draftOrders'
  | 'submittedOrders'
  | 'orderValueInPeriod'
  | 'avgOrderValueInPeriod';

export interface DashboardSummaryKpi {
  id: DashboardSummaryKpiId;
  label: string;
  value: number;
  displayValue: string;
  displayDelta?: string;
  helperText?: string;
}

export interface DashboardSummary {
  asOf: ISODateTime;
  filters: DashboardFilters;
  kpis: DashboardSummaryKpi[];
}

export interface CatalogOverview {
  filters: DashboardFilters;
  totalBikes: number;
  activeBikes: number;
  inactiveBikes: number;
  brandsRepresented?: number;
}

export interface OrderStatusBucket {
  status: string;
  statusValue: string;
  count: number;
}

export interface RecentOrderRow {
  orderId: string;
  orderName: string;
  status: string;
  statusValue: string;
  accountId: string | null;
  accountName: string | null;
  orderDate: ISODate | null;
  createdDate: ISODateTime;
  totalAmount: Money | null;
  displayTotalAmount: DisplayMoney | null;
}

export interface OrdersOverview {
  filters: DashboardFilters;
  byStatus: OrderStatusBucket[];
  recentOrders: RecentOrderRow[];
  totals: {
    orderCount: number;
    orderValue: Money;
    displayOrderValue?: DisplayMoney;
  };
}

export type TrendMetricId = 'orderCount' | 'orderValue';

export interface TrendPoint {
  date: ISODate;
  value: number;
}

export interface TrendSeries {
  id: TrendMetricId;
  label: string;
  points: TrendPoint[];
}

export interface DashboardTrends {
  filters: DashboardFilters;
  granularity: 'day' | 'week';
  series: TrendSeries[];
}

export interface AccountOrderActivity {
  accountId: string;
  accountName: string;
  orderCountInPeriod: number;
  lastOrderDate: ISODate | null;
  lastOrderTotal: Money | null;
  displayLastOrderTotal?: DisplayMoney;
}

export interface AccountActivity {
  filters: DashboardFilters;
  accountsWithOrders: number;
  topAccounts: AccountOrderActivity[];
}

export interface DashboardSnapshot {
  summary: DashboardSummary;
  catalog: CatalogOverview;
  orders: OrdersOverview;
  trends: DashboardTrends;
  accounts: AccountActivity;
}
