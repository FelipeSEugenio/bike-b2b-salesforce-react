import type { DashboardDateRange, DashboardFilters } from '../types/dashboardTypes';

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISODate(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function buildDateRangeLastNDays(days: number): DashboardDateRange {
  const endDate = todayISODate();
  const startDate = addDaysISODate(endDate, -(days - 1));
  return {
    startDate,
    endDate,
    preset: days === 30 ? 'last30' : days === 7 ? 'last7' : 'custom',
  };
}

export function getDefaultDashboardFilters(): DashboardFilters {
  return {
    dateRange: buildDateRangeLastNDays(30),
    accountId: null,
    orderStatuses: undefined,
  };
}
