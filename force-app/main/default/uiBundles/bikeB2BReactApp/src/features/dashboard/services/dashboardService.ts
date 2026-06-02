import { executeGraphQL } from '@/shared/api/graphqlClient';
import { GET_DASHBOARD_BIKES_QUERY } from '../api/dashboardQueries';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';
import { mapBikeKpiCounts } from '../mappers/mapBikeKpiCounts';
import { getDefaultDashboardFilters, todayISODate } from '../utils/defaultFilters';
import type {
  AccountActivity,
  CatalogOverview,
  DashboardFilters,
  DashboardSnapshot,
  DashboardSummary,
  DashboardSummaryKpi,
  DashboardTrends,
  OrdersOverview,
} from '../types/dashboardTypes';

function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

interface DashboardBikesGraphQLResponse {
  uiapi: {
    query: {
      Bike__c: {
        edges: Array<{
          node: {
            Id: string;
            Is_Active__c?: { value: boolean | null } | null;
          };
        }>;
      };
    };
  };
}

/** Order-side mock figures until orders GraphQL is wired. */
const MOCK_METRICS = {
  totalBikes: 24,
  activeBikes: 20,
  brandsRepresented: 6,
  draftOrders: 5,
  submittedOrders: 4,
  approvedOrders: 2,
  fulfilledOrders: 1,
  orderCountInPeriod: 12,
  orderValueInPeriod: 124_900,
};

function resolveFilters(filters?: DashboardFilters): DashboardFilters {
  return filters ?? getDefaultDashboardFilters();
}

async function fetchBikeKpiCounts(): Promise<{ totalBikes: number; activeBikes: number }> {
  const data = await executeGraphQL<DashboardBikesGraphQLResponse, void>(
    GET_DASHBOARD_BIKES_QUERY
  );
  return mapBikeKpiCounts(data.uiapi?.query?.Bike__c?.edges);
}

function buildSummaryKpis(bikeCounts: {
  totalBikes: number;
  activeBikes: number;
}): DashboardSummaryKpi[] {
  const { totalBikes, activeBikes } = bikeCounts;
  const { draftOrders, submittedOrders, orderValueInPeriod, orderCountInPeriod } = MOCK_METRICS;
  const avgOrderValue =
    orderCountInPeriod > 0 ? Math.round(orderValueInPeriod / orderCountInPeriod) : 0;

  return [
    {
      id: 'totalBikes',
      label: 'Total bikes',
      value: totalBikes,
      displayValue: formatCount(totalBikes),
      helperText: 'Bike__c catalog',
    },
    {
      id: 'activeBikes',
      label: 'Active bikes',
      value: activeBikes,
      displayValue: formatCount(activeBikes),
      helperText: 'Is_Active__c = true',
    },
    {
      id: 'draftOrders',
      label: 'Draft orders',
      value: draftOrders,
      displayValue: formatCount(draftOrders),
      helperText: `Status ${BIKE_ORDER_STATUS.DRAFT}`,
    },
    {
      id: 'submittedOrders',
      label: 'Submitted orders',
      value: submittedOrders,
      displayValue: formatCount(submittedOrders),
      helperText: `Status ${BIKE_ORDER_STATUS.SUBMITTED}`,
    },
    {
      id: 'orderValueInPeriod',
      label: 'Order value (period)',
      value: orderValueInPeriod,
      displayValue: formatMoney(orderValueInPeriod),
      helperText: 'Sum of Total_Amount__c',
    },
    {
      id: 'avgOrderValueInPeriod',
      label: 'Avg order value',
      value: avgOrderValue,
      displayValue: formatMoney(avgOrderValue),
      helperText: 'In selected date range',
    },
  ];
}

function lastNDaysISO(n: number): string[] {
  const dates: string[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/**
 * Dashboard data access boundary.
 * Mocked for now; swap internals with executeGraphQL + mappers without changing hook signatures.
 */
export async function getDashboardSummary(
  filters?: DashboardFilters
): Promise<DashboardSummary> {
  const resolved = resolveFilters(filters);
  const bikeCounts = await fetchBikeKpiCounts();
  return {
    asOf: new Date().toISOString(),
    filters: resolved,
    kpis: buildSummaryKpis(bikeCounts),
  };
}

export async function getCatalogOverview(
  filters?: DashboardFilters
): Promise<CatalogOverview> {
  const resolved = resolveFilters(filters);
  const { totalBikes, activeBikes, brandsRepresented } = MOCK_METRICS;
  return {
    filters: resolved,
    totalBikes,
    activeBikes,
    inactiveBikes: totalBikes - activeBikes,
    brandsRepresented,
  };
}

export async function getOrdersOverview(filters?: DashboardFilters): Promise<OrdersOverview> {
  const resolved = resolveFilters(filters);
  const { draftOrders, submittedOrders, approvedOrders, fulfilledOrders, orderValueInPeriod, orderCountInPeriod } =
    MOCK_METRICS;

  return {
    filters: resolved,
    byStatus: [
      { status: BIKE_ORDER_STATUS.DRAFT, statusValue: BIKE_ORDER_STATUS.DRAFT, count: draftOrders },
      {
        status: BIKE_ORDER_STATUS.SUBMITTED,
        statusValue: BIKE_ORDER_STATUS.SUBMITTED,
        count: submittedOrders,
      },
      {
        status: BIKE_ORDER_STATUS.APPROVED,
        statusValue: BIKE_ORDER_STATUS.APPROVED,
        count: approvedOrders,
      },
      {
        status: BIKE_ORDER_STATUS.FULFILLED,
        statusValue: BIKE_ORDER_STATUS.FULFILLED,
        count: fulfilledOrders,
      },
    ],
    recentOrders: [
      {
        orderId: 'mock-001',
        orderName: 'BO-0001',
        status: BIKE_ORDER_STATUS.SUBMITTED,
        statusValue: BIKE_ORDER_STATUS.SUBMITTED,
        accountId: '001mockacme',
        accountName: 'Acme Bikes',
        orderDate: todayISODate(),
        createdDate: new Date().toISOString(),
        totalAmount: 4280,
        displayTotalAmount: '$4,280.00',
      },
      {
        orderId: 'mock-002',
        orderName: 'BO-0002',
        status: BIKE_ORDER_STATUS.DRAFT,
        statusValue: BIKE_ORDER_STATUS.DRAFT,
        accountId: null,
        accountName: null,
        orderDate: todayISODate(),
        createdDate: new Date(Date.now() - 86_400_000).toISOString(),
        totalAmount: 1120,
        displayTotalAmount: '$1,120.00',
      },
    ],
    totals: {
      orderCount: orderCountInPeriod,
      orderValue: orderValueInPeriod,
      displayOrderValue: formatMoney(orderValueInPeriod),
    },
  };
}

export async function getDashboardTrends(filters?: DashboardFilters): Promise<DashboardTrends> {
  const resolved = resolveFilters(filters);
  const dates = lastNDaysISO(14);

  return {
    filters: resolved,
    granularity: 'day',
    series: [
      {
        id: 'orderCount',
        label: 'Orders',
        points: dates.map((date, idx) => ({
          date,
          value: 2 + (idx % 4),
        })),
      },
      {
        id: 'orderValue',
        label: 'Order value',
        points: dates.map((date, idx) => ({
          date,
          value: 8000 + idx * 650,
        })),
      },
    ],
  };
}

export async function getAccountActivity(filters?: DashboardFilters): Promise<AccountActivity> {
  const resolved = resolveFilters(filters);

  return {
    filters: resolved,
    accountsWithOrders: 3,
    topAccounts: [
      {
        accountId: '001mockacme',
        accountName: 'Acme Bikes',
        orderCountInPeriod: 4,
        lastOrderDate: todayISODate(),
        lastOrderTotal: 4280,
        displayLastOrderTotal: '$4,280.00',
      },
      {
        accountId: '001mockglobex',
        accountName: 'Globex Cycling',
        orderCountInPeriod: 2,
        lastOrderDate: todayISODate(),
        lastOrderTotal: 2150,
        displayLastOrderTotal: '$2,150.00',
      },
    ],
  };
}

/** Optional orchestrator for a single dashboard load (GraphQL phase). */
export async function getDashboardSnapshot(
  filters?: DashboardFilters
): Promise<DashboardSnapshot> {
  const resolved = resolveFilters(filters);
  const [summary, catalog, orders, trends, accounts] = await Promise.all([
    getDashboardSummary(resolved),
    getCatalogOverview(resolved),
    getOrdersOverview(resolved),
    getDashboardTrends(resolved),
    getAccountActivity(resolved),
  ]);
  return { summary, catalog, orders, trends, accounts };
}
