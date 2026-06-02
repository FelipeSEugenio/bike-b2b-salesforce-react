import { BIKE_ORDER_STATUS, type BikeOrderStatusValue } from '../constants/orderStatuses';
import type {
  DashboardFilters,
  OrderStatusBucket,
  OrdersOverview,
  RecentOrderRow,
} from '../types/dashboardTypes';

const STATUS_BUCKET_ORDER: BikeOrderStatusValue[] = [
  BIKE_ORDER_STATUS.DRAFT,
  BIKE_ORDER_STATUS.SUBMITTED,
  BIKE_ORDER_STATUS.APPROVED,
  BIKE_ORDER_STATUS.FULFILLED,
  BIKE_ORDER_STATUS.CANCELLED,
];

export const RECENT_ORDERS_LIMIT = 10;

export type DashboardOrderNode = {
  Id: string;
  Name: { value: string };
  Status__c: { value: string; displayValue?: string | null };
  Account__c?: { value: string | null; displayValue?: string | null } | null;
  Total_Amount__c?: { value: number | null; displayValue?: string | null } | null;
  Order_Date__c?: { value: string | null } | null;
  CreatedDate: { value: string; displayValue?: string | null };
};

export type DashboardOrderEdge = {
  node: DashboardOrderNode;
};

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function toOrderDateISO(node: DashboardOrderNode): string | null {
  const orderDate = node.Order_Date__c?.value;
  if (orderDate) {
    return orderDate.slice(0, 10);
  }
  const created = node.CreatedDate?.value;
  return created ? created.slice(0, 10) : null;
}

function mapRecentOrderRow(edge: DashboardOrderEdge): RecentOrderRow {
  const { node } = edge;
  const statusValue = node.Status__c.value;
  const status = node.Status__c.displayValue || statusValue;
  const accountId = node.Account__c?.value ?? null;

  return {
    orderId: node.Id,
    orderName: node.Name.value,
    status,
    statusValue,
    accountId,
    accountName: node.Account__c?.displayValue ?? null,
    orderDate: toOrderDateISO(node),
    createdDate: node.CreatedDate.value,
    totalAmount: node.Total_Amount__c?.value ?? null,
    displayTotalAmount: node.Total_Amount__c?.displayValue ?? null,
  };
}

function compareRecentOrders(a: RecentOrderRow, b: RecentOrderRow): number {
  const dateA = a.orderDate ?? a.createdDate.slice(0, 10);
  const dateB = b.orderDate ?? b.createdDate.slice(0, 10);
  if (dateA !== dateB) {
    return dateB.localeCompare(dateA);
  }
  return b.createdDate.localeCompare(a.createdDate);
}

export function buildStatusBuckets(statusCounts: Map<string, string>): OrderStatusBucket[] {
  const buckets: OrderStatusBucket[] = STATUS_BUCKET_ORDER.map((statusValue) => ({
    statusValue,
    status: statusCounts.get(statusValue) ?? statusValue,
    count: 0,
  }));

  for (const [statusValue, displayStatus] of statusCounts.entries()) {
    const known = buckets.find((b) => b.statusValue === statusValue);
    if (known) {
      known.status = displayStatus;
      continue;
    }
    buckets.push({
      statusValue,
      status: displayStatus,
      count: 0,
    });
  }

  return buckets;
}

export function mapOrdersOverview(
  edges: DashboardOrderEdge[] | null | undefined,
  filters: DashboardFilters
): OrdersOverview {
  const rows = (edges ?? []).map(mapRecentOrderRow);
  const statusCounts = new Map<string, string>();
  const countByStatusValue = new Map<string, number>();

  let orderValue = 0;

  for (const row of rows) {
    const displayStatus = row.status;
    if (!statusCounts.has(row.statusValue)) {
      statusCounts.set(row.statusValue, displayStatus);
    }
    countByStatusValue.set(
      row.statusValue,
      (countByStatusValue.get(row.statusValue) ?? 0) + 1
    );
    if (row.totalAmount != null) {
      orderValue += row.totalAmount;
    }
  }

  const byStatus = buildStatusBuckets(statusCounts).map((bucket) => ({
    ...bucket,
    count: countByStatusValue.get(bucket.statusValue) ?? 0,
  }));

  const recentOrders = [...rows].sort(compareRecentOrders).slice(0, RECENT_ORDERS_LIMIT);

  return {
    filters,
    byStatus,
    recentOrders,
    totals: {
      orderCount: rows.length,
      orderValue,
      displayOrderValue: formatMoney(orderValue),
    },
  };
}

export function countOrdersByStatus(
  overview: OrdersOverview,
  statusValue: BikeOrderStatusValue
): number {
  return overview.byStatus.find((b) => b.statusValue === statusValue)?.count ?? 0;
}
