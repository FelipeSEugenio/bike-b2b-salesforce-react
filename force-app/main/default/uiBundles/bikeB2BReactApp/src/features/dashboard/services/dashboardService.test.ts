import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getDashboardSummary,
  getDashboardTrends,
  getOrdersOverview,
} from './dashboardService';
import { executeGraphQL } from '@/shared/api/graphqlClient';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';

vi.mock('@/shared/api/graphqlClient');

const mockExecuteGraphQL = vi.mocked(executeGraphQL);

const filters = getDefaultDashboardFilters();

const bikesResponse = {
  uiapi: {
    query: {
      Bike__c: {
        edges: [{ node: { Id: '1', Is_Active__c: { value: true } } }],
      },
    },
  },
};

const ordersResponse = {
  uiapi: {
    query: {
      Bike_Order__c: {
        edges: [
          {
            node: {
              Id: 'o1',
              Name: { value: 'BO-0001' },
              Status__c: { value: BIKE_ORDER_STATUS.DRAFT, displayValue: 'Draft' },
              Account__c: { value: '001', displayValue: 'Acme' },
              Total_Amount__c: { value: 1000, displayValue: '$1,000.00' },
              Order_Date__c: { value: '2026-06-02' },
              CreatedDate: { value: '2026-06-02T12:00:00.000Z' },
            },
          },
          {
            node: {
              Id: 'o2',
              Name: { value: 'BO-0002' },
              Status__c: { value: BIKE_ORDER_STATUS.SUBMITTED, displayValue: 'Submitted' },
              Account__c: { value: '002', displayValue: 'Globex' },
              Total_Amount__c: { value: 2500, displayValue: '$2,500.00' },
              Order_Date__c: { value: '2026-06-03' },
              CreatedDate: { value: '2026-06-03T12:00:00.000Z' },
            },
          },
        ],
      },
    },
  },
};

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecuteGraphQL.mockImplementation(async (query: string) => {
      if (query.includes('getDashboardBikes')) {
        return bikesResponse;
      }
      if (query.includes('getDashboardOrders')) {
        return ordersResponse;
      }
      throw new Error(`Unexpected query: ${query}`);
    });
  });

  it('getDashboardSummary uses GraphQL for bike and order KPIs', async () => {
    const summary = await getDashboardSummary(filters);

    expect(mockExecuteGraphQL).toHaveBeenCalledTimes(2);
    expect(summary.kpis.find((k) => k.id === 'totalBikes')).toMatchObject({ value: 1 });
    expect(summary.kpis.find((k) => k.id === 'draftOrders')).toMatchObject({ value: 1 });
    expect(summary.kpis.find((k) => k.id === 'submittedOrders')).toMatchObject({ value: 1 });
    expect(summary.kpis.find((k) => k.id === 'orderValueInPeriod')).toMatchObject({
      value: 3500,
    });
  });

  it('getOrdersOverview returns GraphQL-backed overview', async () => {
    const overview = await getOrdersOverview(filters);

    expect(mockExecuteGraphQL).toHaveBeenCalledTimes(1);
    expect(overview.totals.orderCount).toBe(2);
    expect(overview.recentOrders[0]).toMatchObject({
      orderId: 'o2',
      orderName: 'BO-0002',
      statusValue: BIKE_ORDER_STATUS.SUBMITTED,
    });
  });

  it('getDashboardTrends builds series from the same orders query', async () => {
    const trends = await getDashboardTrends(filters);

    expect(mockExecuteGraphQL).toHaveBeenCalledTimes(1);
    expect(trends.series.map((s) => s.id)).toEqual(['orderCount', 'orderValue']);
    const orderCount = trends.series.find((s) => s.id === 'orderCount');
    expect(orderCount?.points.some((p) => p.value > 0)).toBe(true);
  });
});
