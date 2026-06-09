import React from 'react';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useDashboardTrends } from '../hooks/useDashboardTrends';
import { useOrdersOverview } from '../hooks/useOrdersOverview';
import { useAccountActivity } from '../hooks/useAccountActivity';
import DashboardKpiCard from './DashboardKpiCard';
import DashboardTrendChart from './DashboardTrendChart';
import DashboardFiltersPanel from './DashboardFiltersPanel';
import DashboardRecentOrdersTable from './DashboardRecentOrdersTable';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { TrendMetricId } from '../types/dashboardTypes';

const TREND_CHART_IDS: TrendMetricId[] = ['orderCount', 'orderValue'];

const DashboardPage: React.FC = () => {
  const { filters } = useDashboardFilters();
  const { summary, loading: summaryLoading, error: summaryError } = useDashboardSummary(filters);
  const { trends, loading: trendsLoading, error: trendsError } = useDashboardTrends(filters);
  const {
    ordersOverview,
    loading: ordersLoading,
    error: ordersError,
  } = useOrdersOverview(filters);
  const {
    accountActivity,
    loading: accountsLoading,
    error: accountsError,
  } = useAccountActivity(filters);

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          Comprehensive overview of bikes, orders, and key account activities.
        </p>
        {summary?.asOf && (
          <p className="mt-1 text-xs text-muted-foreground">
            As of {new Date(summary.asOf).toLocaleString()}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
        <div className="space-y-8 min-w-0">
          <section aria-label="Summary KPIs" className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {summaryLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border p-4 bg-card space-y-3"
                    >
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  ))
              ) : summaryError ? (
                <div className="col-span-full rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">
                  Failed to load summary: {summaryError}
                </div>
              ) : (
                summary?.kpis.map((kpi) => <DashboardKpiCard key={kpi.id} kpi={kpi} />)
              )}
            </div>
          </section>

          <section aria-label="Charts and tables" className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendsLoading
                ? TREND_CHART_IDS.map((chartId) => (
                    <DashboardTrendChart key={chartId} chartId={chartId} series={null} loading />
                  ))
                : TREND_CHART_IDS.map((chartId) => (
                    <DashboardTrendChart
                      key={chartId}
                      chartId={chartId}
                      series={trends?.series.find((item) => item.id === chartId) ?? null}
                      granularity={trends?.granularity}
                      error={trendsError}
                    />
                  ))}
            </div>

            <div aria-label="Recent orders" className="pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recent orders
              </h3>
              <DashboardRecentOrdersTable
                ordersOverview={ordersOverview}
                loading={ordersLoading}
                error={ordersError}
              />
            </div>
          </section>
        </div>

        <aside aria-label="Filters and context" className="w-full">
          <DashboardFiltersPanel
            filters={filters}
            accountActivity={accountActivity}
            accountsLoading={accountsLoading}
            accountsError={accountsError}
          />
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
