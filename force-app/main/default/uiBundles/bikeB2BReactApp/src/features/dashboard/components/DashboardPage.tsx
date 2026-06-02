import React from 'react';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useDashboardTrends } from '../hooks/useDashboardTrends';
import { useOrdersOverview } from '../hooks/useOrdersOverview';
import { useAccountActivity } from '../hooks/useAccountActivity';
import DashboardKpiCard from './DashboardKpiCard';
import DashboardChartPlaceholder from './DashboardChartPlaceholder';
import DashboardFiltersPanel from './DashboardFiltersPanel';
import DashboardRecentOrdersTable from './DashboardRecentOrdersTable';

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

  const loading = summaryLoading || trendsLoading || ordersLoading || accountsLoading;
  const error = summaryError ?? trendsError ?? ordersError ?? accountsError;

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          B2B operational view — bikes, orders, and account activity (mocked contracts).
        </p>
        {summary?.asOf && !loading && (
          <p className="mt-1 text-xs text-muted-foreground">
            As of {new Date(summary.asOf).toLocaleString()}
          </p>
        )}
      </header>

      {loading && (
        <div className="flex items-center gap-3 py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
          <span className="text-muted-foreground text-sm font-medium">Loading dashboard...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex gap-3 text-destructive">
          <div className="text-sm font-medium">
            Something went wrong while loading the dashboard:{' '}
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          <div className="space-y-8 min-w-0">
            <section aria-label="Summary KPIs" className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {summary?.kpis.map((kpi) => (
                  <DashboardKpiCard key={kpi.id} kpi={kpi} />
                ))}
              </div>
            </section>

            <section aria-label="Charts and tables" className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Trends
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trends?.series.map((series) => (
                  <DashboardChartPlaceholder key={series.id} series={series} />
                ))}
              </div>
              {ordersOverview && (
                <div aria-label="Recent orders">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Recent orders
                  </h3>
                  <DashboardRecentOrdersTable ordersOverview={ordersOverview} />
                </div>
              )}
            </section>
          </div>

          <aside aria-label="Filters and context" className="w-full">
            <DashboardFiltersPanel filters={filters} accountActivity={accountActivity} />
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
