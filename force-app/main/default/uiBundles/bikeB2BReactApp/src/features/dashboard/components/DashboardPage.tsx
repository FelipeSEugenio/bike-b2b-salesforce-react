import React from 'react';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useDashboardTrends } from '../hooks/useDashboardTrends';
import DashboardKpiCard from './DashboardKpiCard';
import DashboardChartPlaceholder from './DashboardChartPlaceholder';
import DashboardFiltersPanel from './DashboardFiltersPanel';

const DashboardPage: React.FC = () => {
  const { summary, loading: summaryLoading, error: summaryError } = useDashboardSummary();
  const { trends, loading: trendsLoading, error: trendsError } = useDashboardTrends();

  const loading = summaryLoading || trendsLoading;
  const error = summaryError ?? trendsError;

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          B2B sales overview — structure only; KPIs and charts will be wired to GraphQL later.
        </p>
        {summary?.asOfDateISO && !loading && (
          <p className="mt-1 text-xs text-muted-foreground">As of {summary.asOfDateISO}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
              <CardTablePlaceholder />
            </section>
          </div>

          <aside aria-label="Filters and context" className="w-full">
            <DashboardFiltersPanel />
          </aside>
        </div>
      )}
    </div>
  );
};

/** TODO: Replace with orders overview table fed by getDashboardOrdersOverview(). */
function CardTablePlaceholder() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
      Table area — orders overview placeholder
    </div>
  );
}

export default DashboardPage;
