import { describe, it, expect } from 'vitest';
import { mapAccountActivity } from './mapAccountActivity';
import type { DashboardOrderEdge } from './mapOrdersOverview';
import type { DashboardFilters } from '../types/dashboardTypes';

describe('mapAccountActivity', () => {
  const mockFilters: DashboardFilters = {
    dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
  };

  const mockEdges: DashboardOrderEdge[] = [
    {
      node: {
        Id: '1',
        Name: { value: 'O-001' },
        Status__c: { value: 'Draft', displayValue: 'Draft' },
        Account__c: { value: 'acc1', displayValue: 'Account One' },
        Total_Amount__c: { value: 1000, displayValue: '$1,000.00' },
        Order_Date__c: { value: '2024-01-10' },
        CreatedDate: { value: '2024-01-10T10:00:00Z' },
      },
    },
    {
      node: {
        Id: '2',
        Name: { value: 'O-002' },
        Status__c: { value: 'Draft', displayValue: 'Draft' },
        Account__c: { value: 'acc1', displayValue: 'Account One' },
        Total_Amount__c: { value: 500, displayValue: '$500.00' },
        Order_Date__c: { value: '2024-01-20' },
        CreatedDate: { value: '2024-01-20T10:00:00Z' },
      },
    },
    {
      node: {
        Id: '3',
        Name: { value: 'O-003' },
        Status__c: { value: 'Draft', displayValue: 'Draft' },
        Account__c: { value: 'acc2', displayValue: 'Account Two' },
        Total_Amount__c: { value: 2000, displayValue: '$2,000.00' },
        Order_Date__c: { value: '2024-01-15' },
        CreatedDate: { value: '2024-01-15T10:00:00Z' },
      },
    },
  ];

  it('aggregates orders by account', () => {
    const result = mapAccountActivity(mockEdges, mockFilters);

    expect(result.accountsWithOrders).toBe(2);
    expect(result.topAccounts).toHaveLength(2);

    // Account Two should be first because it has higher total value (2000 vs 1500)
    expect(result.topAccounts[0].accountId).toBe('acc2');
    expect(result.topAccounts[0].orderCountInPeriod).toBe(1);
    expect(result.topAccounts[0].accountName).toBe('Account Two');

    expect(result.topAccounts[1].accountId).toBe('acc1');
    expect(result.topAccounts[1].orderCountInPeriod).toBe(2);
    expect(result.topAccounts[1].accountName).toBe('Account One');
  });

  it('correctly identifies last order date and total', () => {
    const result = mapAccountActivity(mockEdges, mockFilters);
    const acc1 = result.topAccounts.find((a) => a.accountId === 'acc1');

    expect(acc1?.lastOrderDate).toBe('2024-01-20');
    expect(acc1?.lastOrderTotal).toBe(500);
  });

  it('handles empty edges', () => {
    const result = mapAccountActivity([], mockFilters);
    expect(result.accountsWithOrders).toBe(0);
    expect(result.topAccounts).toHaveLength(0);
  });
});
