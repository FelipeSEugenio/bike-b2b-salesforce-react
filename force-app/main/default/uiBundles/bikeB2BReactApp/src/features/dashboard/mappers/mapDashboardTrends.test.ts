import { describe, it, expect } from 'vitest';
import { mapDashboardTrends } from './mapDashboardTrends';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';
import type { DashboardOrderEdge } from './mapOrdersOverview';
import type { DashboardFilters } from '../types/dashboardTypes';

const filters: DashboardFilters = {
  dateRange: { startDate: '2026-06-01', endDate: '2026-06-03', preset: 'custom' },
  accountId: null,
};

function edge(id: string, date: string, amount: number): DashboardOrderEdge {
  return {
    node: {
      Id: id,
      Name: { value: `BO-${id}` },
      Status__c: { value: BIKE_ORDER_STATUS.DRAFT, displayValue: 'Draft' },
      Total_Amount__c: { value: amount, displayValue: `$${amount}` },
      Order_Date__c: { value: date },
      CreatedDate: { value: `${date}T12:00:00.000Z` },
    },
  };
}

describe('mapDashboardTrends', () => {
  it('buckets orderCount and orderValue by day across the filter range', () => {
    const trends = mapDashboardTrends(
      [
        edge('1', '2026-06-01', 100),
        edge('2', '2026-06-01', 200),
        edge('3', '2026-06-03', 500),
      ],
      filters
    );

    expect(trends.granularity).toBe('day');
    expect(trends.series).toHaveLength(2);

    const orderCount = trends.series.find((s) => s.id === 'orderCount');
    const orderValue = trends.series.find((s) => s.id === 'orderValue');

    expect(orderCount?.points).toEqual([
      { date: '2026-06-01', value: 2 },
      { date: '2026-06-02', value: 0 },
      { date: '2026-06-03', value: 1 },
    ]);
    expect(orderValue?.points).toEqual([
      { date: '2026-06-01', value: 300 },
      { date: '2026-06-02', value: 0 },
      { date: '2026-06-03', value: 500 },
    ]);
  });
});
