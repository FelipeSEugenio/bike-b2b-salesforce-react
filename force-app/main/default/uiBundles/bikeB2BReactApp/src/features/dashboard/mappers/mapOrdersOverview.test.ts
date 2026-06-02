import { describe, it, expect } from 'vitest';
import {
  buildStatusBuckets,
  mapOrdersOverview,
  type DashboardOrderEdge,
} from './mapOrdersOverview';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';

const filters = getDefaultDashboardFilters();

function makeEdge(
  overrides: Partial<DashboardOrderEdge['node']> & { Id: string }
): DashboardOrderEdge {
  return {
    node: {
      Name: { value: 'BO-TEST' },
      Status__c: { value: BIKE_ORDER_STATUS.DRAFT, displayValue: 'Draft' },
      Account__c: { value: '001', displayValue: 'Acme' },
      Total_Amount__c: { value: 1000, displayValue: '$1,000.00' },
      Order_Date__c: { value: '2026-06-01' },
      CreatedDate: { value: '2026-06-01T10:00:00.000Z' },
      ...overrides,
    },
  };
}

describe('buildStatusBuckets', () => {
  it('includes known statuses with zero counts', () => {
    const buckets = buildStatusBuckets(new Map([[BIKE_ORDER_STATUS.DRAFT, 'Draft']]));
    const draft = buckets.find((b) => b.statusValue === BIKE_ORDER_STATUS.DRAFT);
    const submitted = buckets.find((b) => b.statusValue === BIKE_ORDER_STATUS.SUBMITTED);
    expect(draft?.count).toBe(0);
    expect(submitted?.count).toBe(0);
  });
});

describe('mapOrdersOverview', () => {
  const edges: DashboardOrderEdge[] = [
    makeEdge({
      Id: 'o1',
      Name: { value: 'BO-0001' },
      Status__c: { value: BIKE_ORDER_STATUS.DRAFT, displayValue: 'Draft' },
      Total_Amount__c: { value: 500, displayValue: '$500.00' },
      Order_Date__c: { value: '2026-06-02' },
    }),
    makeEdge({
      Id: 'o2',
      Name: { value: 'BO-0002' },
      Status__c: { value: BIKE_ORDER_STATUS.SUBMITTED, displayValue: 'Submitted' },
      Total_Amount__c: { value: 1500, displayValue: '$1,500.00' },
      Order_Date__c: { value: '2026-06-03' },
    }),
    makeEdge({
      Id: 'o3',
      Name: { value: 'BO-0003' },
      Status__c: { value: BIKE_ORDER_STATUS.SUBMITTED, displayValue: 'Submitted' },
      Total_Amount__c: { value: 2000, displayValue: '$2,000.00' },
      Order_Date__c: { value: '2026-06-01' },
    }),
  ];

  it('aggregates byStatus buckets and period totals', () => {
    const overview = mapOrdersOverview(edges, filters);

    expect(overview.totals.orderCount).toBe(3);
    expect(overview.totals.orderValue).toBe(4000);
    expect(
      overview.byStatus.find((b) => b.statusValue === BIKE_ORDER_STATUS.DRAFT)?.count
    ).toBe(1);
    expect(
      overview.byStatus.find((b) => b.statusValue === BIKE_ORDER_STATUS.SUBMITTED)?.count
    ).toBe(2);
  });

  it('maps recent orders sorted by order date descending', () => {
    const overview = mapOrdersOverview(edges, filters);

    expect(overview.recentOrders.slice(0, 2)).toEqual([
      expect.objectContaining({ orderId: 'o2', orderName: 'BO-0002', statusValue: 'Submitted' }),
      expect.objectContaining({ orderId: 'o1', orderName: 'BO-0001', statusValue: 'Draft' }),
    ]);
  });
});
