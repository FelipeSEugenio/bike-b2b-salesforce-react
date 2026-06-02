import { executeGraphQL } from '@/shared/api/graphqlClient';
import { GET_DASHBOARD_BIKES_QUERY, GET_DASHBOARD_ORDERS_QUERY } from '../api/dashboardQueries';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';
import { mapBikeKpiCounts } from '../mappers/mapBikeKpiCounts';
import { mapDashboardTrends } from '../mappers/mapDashboardTrends';
import { mapAccountActivity } from '../mappers/mapAccountActivity';
import {
  countOrdersByStatus,
  mapOrdersOverview,
  type DashboardOrderEdge,
} from '../mappers/mapOrdersOverview';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';
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

interface DashboardOrdersGraphQLResponse {
  uiapi: {
    query: {
      Bike_Order__c: {
        edges: DashboardOrderEdge[];
      };
    };
  };
}

/** Catalog mock until bike overview uses the same GraphQL source. */
const MOCK_CATALOG = {
  brandsRepresented: 6,
};

function resolveFilters(filters?: DashboardFilters): DashboardFilters {
  return filters ?? getDefaultDashboardFilters();
}

function toDateInput(isoDate: string): { value: string } {
  return { value: isoDate };
}

async function fetchBikeKpiCounts(): Promise<{ totalBikes: number; activeBikes: number }> {
  const data = await executeGraphQL<DashboardBikesGraphQLResponse, void>(
    GET_DASHBOARD_BIKES_QUERY
  );
  return mapBikeKpiCounts(data.uiapi?.query?.Bike__c?.edges);
}

async function fetchDashboardOrderEdges(
  filters: DashboardFilters
): Promise<DashboardOrderEdge[]> {
  const { startDate, endDate } = filters.dateRange;
  const data = await executeGraphQL<
    DashboardOrdersGraphQLResponse,
    { startDate: { value: string }; endDate: { value: string } }
  >(GET_DASHBOARD_ORDERS_QUERY, {
    startDate: toDateInput(startDate),
    endDate: toDateInput(endDate),
  });

  return data.uiapi?.query?.Bike_Order__c?.edges ?? [];
}

async function fetchOrdersOverviewFromGraphQL(
  filters: DashboardFilters
): Promise<OrdersOverview> {
  const edges = await fetchDashboardOrderEdges(filters);
  return mapOrdersOverview(edges, filters);
}

function buildSummaryKpis(
  bikeCounts: { totalBikes: number; activeBikes: number },
  ordersOverview: OrdersOverview
): DashboardSummaryKpi[] {
  const { totalBikes, activeBikes } = bikeCounts;
  const draftOrders = countOrdersByStatus(ordersOverview, BIKE_ORDER_STATUS.DRAFT);
  const submittedOrders = countOrdersByStatus(ordersOverview, BIKE_ORDER_STATUS.SUBMITTED);
  const { orderCount, orderValue } = ordersOverview.totals;
  const avgOrderValue = orderCount > 0 ? Math.round(orderValue / orderCount) : 0;

  return [
    {
      id: 'totalBikes',
      label: 'Total bikes',
      value: totalBikes,
      displayValue: formatCount(totalBikes),
      helperText: 'Total bikes in catalog',
    },
    {
      id: 'activeBikes',
      label: 'Active bikes',
      value: activeBikes,
      displayValue: formatCount(activeBikes),
      helperText: 'Currently active and sellable',
    },
    {
      id: 'draftOrders',
      label: 'Draft orders',
      value: draftOrders,
      displayValue: formatCount(draftOrders),
      helperText: 'Orders pending submission',
    },
    {
      id: 'submittedOrders',
      label: 'Submitted orders',
      value: submittedOrders,
      displayValue: formatCount(submittedOrders),
      helperText: 'Orders awaiting review',
    },
    {
      id: 'orderValueInPeriod',
      label: 'Order value (period)',
      value: orderValue,
      displayValue: ordersOverview.totals.displayOrderValue ?? formatMoney(orderValue),
      helperText: 'Gross value for selected period',
    },
    {
      id: 'avgOrderValueInPeriod',
      label: 'Avg order value',
      value: avgOrderValue,
      displayValue: formatMoney(avgOrderValue),
      helperText: 'Average value per order',
    },
  ];
}

export async function getDashboardSummary(
  filters?: DashboardFilters
): Promise<DashboardSummary> {
  const resolved = resolveFilters(filters);
  const [bikeCounts, ordersOverview] = await Promise.all([
    fetchBikeKpiCounts(),
    fetchOrdersOverviewFromGraphQL(resolved),
  ]);

  return {
    asOf: new Date().toISOString(),
    filters: resolved,
    kpis: buildSummaryKpis(bikeCounts, ordersOverview),
  };
}

export async function getCatalogOverview(
  filters?: DashboardFilters
): Promise<CatalogOverview> {
  const resolved = resolveFilters(filters);
  const bikeCounts = await fetchBikeKpiCounts();
  return {
    filters: resolved,
    totalBikes: bikeCounts.totalBikes,
    activeBikes: bikeCounts.activeBikes,
    inactiveBikes: bikeCounts.totalBikes - bikeCounts.activeBikes,
    brandsRepresented: MOCK_CATALOG.brandsRepresented,
  };
}

export async function getOrdersOverview(filters?: DashboardFilters): Promise<OrdersOverview> {
  const resolved = resolveFilters(filters);
  return fetchOrdersOverviewFromGraphQL(resolved);
}

export async function getDashboardTrends(filters?: DashboardFilters): Promise<DashboardTrends> {
  const resolved = resolveFilters(filters);
  const edges = await fetchDashboardOrderEdges(resolved);
  return mapDashboardTrends(edges, resolved);
}

export async function getAccountActivity(filters?: DashboardFilters): Promise<AccountActivity> {
  const resolved = resolveFilters(filters);
  const edges = await fetchDashboardOrderEdges(resolved);
  return mapAccountActivity(edges, resolved);
}

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
