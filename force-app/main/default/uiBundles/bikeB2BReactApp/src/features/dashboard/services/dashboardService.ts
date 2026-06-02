import type {
  DashboardOrdersOverview,
  DashboardSummary,
  DashboardTrends,
} from '../types/dashboardTypes';

function todayISODate() {
  // ISO date only for stable display boundaries (no timezone formatting here)
  return new Date().toISOString().slice(0, 10);
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
 * Dashboard "data access boundary".
 * For this branch we return mocked data, but the API is shaped so we can later
 * swap in GraphQL (via executeGraphQL) without changing callers.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return {
    asOfDateISO: todayISODate(),
    kpis: [
      {
        id: 'openOrders',
        label: 'Open orders',
        displayValue: '12',
        displayDelta: '+2',
        helperText: 'vs last week',
      },
      {
        id: 'ordersThisMonth',
        label: 'Orders (MTD)',
        displayValue: '48',
        displayDelta: '+8%',
        helperText: 'vs last month',
      },
      {
        id: 'revenueThisMonth',
        label: 'Revenue (MTD)',
        displayValue: '$124,900',
        displayDelta: '+5%',
        helperText: 'vs last month',
      },
      {
        id: 'avgOrderValue',
        label: 'Avg order value',
        displayValue: '$2,600',
        displayDelta: '-1.2%',
        helperText: 'vs last month',
      },
    ],
  };
}

export async function getDashboardTrends(): Promise<DashboardTrends> {
  const dates = lastNDaysISO(14);
  return {
    range: {
      startDateISO: dates[0] ?? todayISODate(),
      endDateISO: dates[dates.length - 1] ?? todayISODate(),
      granularity: 'day',
    },
    series: [
      {
        id: 'orders',
        label: 'Orders',
        points: dates.map((dateISO, idx) => ({
          dateISO,
          value: 10 + (idx % 5),
        })),
      },
      {
        id: 'revenue',
        label: 'Revenue',
        points: dates.map((dateISO, idx) => ({
          dateISO,
          value: 15000 + idx * 700,
        })),
      },
    ],
  };
}

export async function getDashboardOrdersOverview(): Promise<DashboardOrdersOverview> {
  return {
    byStatus: [
      { status: 'Draft', count: 5 },
      { status: 'Submitted', count: 4 },
      { status: 'Approved', count: 2 },
      { status: 'Activated', count: 1 },
    ],
    mostRecent: [
      {
        orderId: 'mock-001',
        orderName: 'BO-0001',
        createdDateISO: new Date().toISOString(),
        status: 'Submitted',
        displayTotal: '$4,280',
      },
      {
        orderId: 'mock-002',
        orderName: 'BO-0002',
        createdDateISO: new Date(Date.now() - 86_400_000).toISOString(),
        status: 'Draft',
        displayTotal: '$1,120',
      },
    ],
  };
}

