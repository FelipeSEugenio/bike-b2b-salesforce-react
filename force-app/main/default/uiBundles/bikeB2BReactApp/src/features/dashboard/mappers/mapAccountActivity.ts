import { toOrderDateISO, type DashboardOrderEdge } from './mapOrdersOverview';
import type {
  AccountActivity,
  AccountOrderActivity,
  DashboardFilters,
} from '../types/dashboardTypes';

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function mapAccountActivity(
  edges: DashboardOrderEdge[] | null | undefined,
  filters: DashboardFilters
): AccountActivity {
  const accountMap = new Map<string, AccountOrderActivity & { totalValue: number }>();

  for (const edge of edges ?? []) {
    const { node } = edge;
    const accountId = node.Account__c?.value;
    const accountName = node.Account__c?.displayValue;

    if (!accountId || !accountName) continue;

    const currentTotal = node.Total_Amount__c?.value ?? 0;
    const currentDate = toOrderDateISO(node);

    const existing = accountMap.get(accountId);

    if (existing) {
      existing.orderCountInPeriod += 1;
      existing.totalValue += currentTotal;
      
      // Update last order if this one is newer
      if (currentDate && (!existing.lastOrderDate || currentDate > existing.lastOrderDate)) {
        existing.lastOrderDate = currentDate;
        existing.lastOrderTotal = currentTotal;
        existing.displayLastOrderTotal = node.Total_Amount__c?.displayValue ?? formatMoney(currentTotal);
      }
    } else {
      accountMap.set(accountId, {
        accountId,
        accountName,
        orderCountInPeriod: 1,
        totalValue: currentTotal,
        lastOrderDate: currentDate,
        lastOrderTotal: currentTotal,
        displayLastOrderTotal: node.Total_Amount__c?.displayValue ?? formatMoney(currentTotal),
      });
    }
  }

  // Sort by total value in period (descending)
  const sortedAccounts = Array.from(accountMap.values())
    .sort((a, b) => b.totalValue - a.totalValue)
    .map(({ totalValue, ...rest }) => ({
      ...rest,
    }));

  return {
    filters,
    accountsWithOrders: accountMap.size,
    topAccounts: sortedAccounts.slice(0, 5), // Limit to top 5 for sidebar
  };
}
