import { addDaysISODate } from '../utils/defaultFilters';
import type { DashboardFilters, DashboardTrends, ISODate } from '../types/dashboardTypes';
import { toOrderDateISO, type DashboardOrderEdge } from './mapOrdersOverview';

const WEEKLY_BUCKET_THRESHOLD_DAYS = 31;

export function enumerateDateRange(startDate: ISODate, endDate: ISODate): ISODate[] {
  const dates: ISODate[] = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    dates.push(cursor);
    cursor = addDaysISODate(cursor, 1);
  }
  return dates;
}

function startOfWeekISO(isoDate: ISODate): ISODate {
  const d = new Date(`${isoDate}T00:00:00`);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function enumerateWeekRange(startDate: ISODate, endDate: ISODate): ISODate[] {
  const weeks: ISODate[] = [];
  let cursor = startOfWeekISO(startDate);
  const endWeek = startOfWeekISO(endDate);
  while (cursor <= endWeek) {
    weeks.push(cursor);
    cursor = addDaysISODate(cursor, 7);
  }
  return weeks;
}

export function mapDashboardTrends(
  edges: DashboardOrderEdge[] | null | undefined,
  filters: DashboardFilters
): DashboardTrends {
  const { startDate, endDate } = filters.dateRange;
  const dailyDates = enumerateDateRange(startDate, endDate);
  const useWeeklyBuckets = dailyDates.length > WEEKLY_BUCKET_THRESHOLD_DAYS;
  const bucketDates = useWeeklyBuckets
    ? enumerateWeekRange(startDate, endDate)
    : dailyDates;

  const countByBucket = new Map<ISODate, number>(
    bucketDates.map((date) => [date, 0])
  );
  const valueByBucket = new Map<ISODate, number>(
    bucketDates.map((date) => [date, 0])
  );

  for (const edge of edges ?? []) {
    const orderDate = toOrderDateISO(edge.node);
    if (!orderDate || orderDate < startDate || orderDate > endDate) {
      continue;
    }

    const bucketKey = useWeeklyBuckets ? startOfWeekISO(orderDate) : orderDate;
    if (!countByBucket.has(bucketKey)) {
      continue;
    }

    countByBucket.set(bucketKey, (countByBucket.get(bucketKey) ?? 0) + 1);
    const amount = edge.node.Total_Amount__c?.value ?? 0;
    valueByBucket.set(bucketKey, (valueByBucket.get(bucketKey) ?? 0) + amount);
  }

  const toPoints = (values: Map<ISODate, number>) =>
    bucketDates.map((date) => ({
      date,
      value: values.get(date) ?? 0,
    }));

  return {
    filters,
    granularity: useWeeklyBuckets ? 'week' : 'day',
    series: [
      {
        id: 'orderCount',
        label: 'Orders',
        points: toPoints(countByBucket),
      },
      {
        id: 'orderValue',
        label: 'Order value',
        points: toPoints(valueByBucket),
      },
    ],
  };
}
