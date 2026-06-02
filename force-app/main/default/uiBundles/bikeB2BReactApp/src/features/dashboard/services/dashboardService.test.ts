import { describe, it, expect } from 'vitest';
import {
  getDashboardSummary,
  getOrdersOverview,
} from './dashboardService';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';

describe('dashboardService (mocked contracts)', () => {
  const filters = getDefaultDashboardFilters();

  it('getDashboardSummary returns domain KPI ids and numeric values', async () => {
    const summary = await getDashboardSummary(filters);

    expect(summary.filters.dateRange.startDate).toBeDefined();
    expect(summary.asOf).toBeTruthy();
    expect(summary.kpis.length).toBe(6);

    const totalBikes = summary.kpis.find((k) => k.id === 'totalBikes');
    expect(totalBikes).toMatchObject({
      id: 'totalBikes',
      value: expect.any(Number),
      displayValue: expect.any(String),
    });

    const draftOrders = summary.kpis.find((k) => k.id === 'draftOrders');
    expect(draftOrders?.value).toBeGreaterThan(0);
    expect(draftOrders?.displayValue).toBeTruthy();
  });

  it('getOrdersOverview returns status buckets and recent orders', async () => {
    const overview = await getOrdersOverview(filters);

    expect(overview.totals.orderCount).toBeGreaterThan(0);
    expect(overview.totals.orderValue).toBeGreaterThan(0);
    expect(overview.totals.displayOrderValue).toBeTruthy();

    expect(overview.byStatus.some((b) => b.statusValue === BIKE_ORDER_STATUS.DRAFT)).toBe(
      true
    );
    expect(overview.recentOrders.length).toBeGreaterThan(0);
    expect(overview.recentOrders[0]).toMatchObject({
      orderId: expect.any(String),
      orderName: expect.any(String),
      statusValue: expect.any(String),
      totalAmount: expect.any(Number),
      displayTotalAmount: expect.any(String),
    });
  });
});
