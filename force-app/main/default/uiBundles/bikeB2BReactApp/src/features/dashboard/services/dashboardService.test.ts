import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getDashboardSummary,
  getOrdersOverview,
} from './dashboardService';
import { executeGraphQL } from '@/shared/api/graphqlClient';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';

vi.mock('@/shared/api/graphqlClient');

const mockExecuteGraphQL = vi.mocked(executeGraphQL);

describe('dashboardService', () => {
  const filters = getDefaultDashboardFilters();

  beforeEach(() => {
    vi.clearAllMocks();
    mockExecuteGraphQL.mockResolvedValue({
      uiapi: {
        query: {
          Bike__c: {
            edges: [
              { node: { Id: '1', Is_Active__c: { value: true } } },
              { node: { Id: '2', Is_Active__c: { value: false } } },
              { node: { Id: '3', Is_Active__c: { value: true } } },
            ],
          },
        },
      },
    });
  });

  it('getDashboardSummary maps bike KPIs from GraphQL and keeps order KPIs mocked', async () => {
    const summary = await getDashboardSummary(filters);

    expect(mockExecuteGraphQL).toHaveBeenCalledTimes(1);
    expect(summary.kpis.length).toBe(6);

    const totalBikes = summary.kpis.find((k) => k.id === 'totalBikes');
    const activeBikes = summary.kpis.find((k) => k.id === 'activeBikes');
    expect(totalBikes).toMatchObject({ value: 3, displayValue: '3' });
    expect(activeBikes).toMatchObject({ value: 2, displayValue: '2' });

    const draftOrders = summary.kpis.find((k) => k.id === 'draftOrders');
    expect(draftOrders?.value).toBeGreaterThan(0);
  });

  it('getOrdersOverview returns status buckets and recent orders (mocked)', async () => {
    const overview = await getOrdersOverview(filters);

    expect(mockExecuteGraphQL).not.toHaveBeenCalled();
    expect(overview.totals.orderCount).toBeGreaterThan(0);
    expect(overview.byStatus.some((b) => b.statusValue === BIKE_ORDER_STATUS.DRAFT)).toBe(
      true
    );
    expect(overview.recentOrders[0]).toMatchObject({
      orderId: expect.any(String),
      displayTotalAmount: expect.any(String),
    });
  });
});
