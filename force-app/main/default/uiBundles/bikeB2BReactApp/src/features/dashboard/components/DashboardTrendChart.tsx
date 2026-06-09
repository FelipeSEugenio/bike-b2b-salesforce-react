import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { TrendMetricId, TrendSeries } from '../types/dashboardTypes';

interface DashboardTrendChartProps {
  series: TrendSeries | null;
  granularity?: 'day' | 'week';
  loading?: boolean;
  error?: string | null;
  /** Stable card identity when series data is unavailable (loading/error). */
  chartId?: TrendMetricId;
}

const CHART_LABELS: Record<TrendMetricId, string> = {
  orderCount: 'Orders',
  orderValue: 'Order value',
};

const CHART_MARGIN = { top: 10, right: 10, left: -20, bottom: 0 };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr: string, granularity: 'day' | 'week' = 'day') => {
  const date = new Date(`${dateStr}T00:00:00`);
  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return granularity === 'week' ? `Week of ${formatted}` : formatted;
};

const formatCurrencyAxis = (value: number) => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }
  return `$${value}`;
};

const tooltipStyle = {
  backgroundColor: 'var(--color-card)',
  borderColor: 'var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '12px',
  color: 'var(--color-foreground)',
  boxShadow: '0 4px 12px rgb(0 0 0 / 0.12)',
};

const axisTickStyle = { fill: 'var(--color-muted-foreground)', fontSize: 10 };

function seriesHasData(series: TrendSeries) {
  return series.points.some((point) => point.value > 0);
}

function getChartMeta(chartId: TrendMetricId, granularity: 'day' | 'week' = 'day') {
  const isCurrency = chartId === 'orderValue';
  const cadence = granularity === 'week' ? 'Weekly' : 'Daily';
  return {
    isCurrency,
    color: isCurrency ? 'var(--color-chart-2)' : 'var(--color-chart-1)',
    description: isCurrency
      ? `${cadence} order value for the selected period`
      : `${cadence} order volume for the selected period`,
  };
}

interface TrendChartAxesProps {
  isCurrency: boolean;
  granularity: 'day' | 'week';
  label: string;
}

const TrendChartAxes: React.FC<TrendChartAxesProps> = ({ isCurrency, granularity, label }) => (
  <>
    <CartesianGrid
      vertical={false}
      strokeDasharray="3 3"
      stroke="var(--color-border)"
      opacity={0.4}
    />
    <XAxis
      dataKey="date"
      tickFormatter={(date) => formatDate(date, granularity)}
      axisLine={false}
      tickLine={false}
      tick={axisTickStyle}
      minTickGap={30}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={axisTickStyle}
      allowDecimals={!isCurrency}
      tickFormatter={(value: number) => (isCurrency ? formatCurrencyAxis(value) : String(value))}
      width={48}
    />
    <Tooltip
      cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
      contentStyle={tooltipStyle}
      itemStyle={{ color: 'var(--color-foreground)', fontWeight: 600 }}
      labelFormatter={(date) => formatDate(String(date), granularity)}
      formatter={(value) => {
        const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
        return [isCurrency ? formatCurrency(numericValue) : numericValue, label];
      }}
    />
  </>
);

const DashboardTrendChart: React.FC<DashboardTrendChartProps> = ({
  series,
  granularity = 'day',
  loading,
  error,
  chartId,
}) => {
  const resolvedChartId = series?.id ?? chartId;
  const label = series?.label ?? (resolvedChartId ? CHART_LABELS[resolvedChartId] : 'Trends');
  const meta = resolvedChartId ? getChartMeta(resolvedChartId, granularity) : null;

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <Skeleton className="h-3 w-52" />
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <Skeleton className="mx-6 mb-6 h-[240px] w-[calc(100%-3rem)] rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full overflow-hidden border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <CardDescription className="text-xs">Trend data unavailable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-destructive/20 bg-card/50 p-6 text-center">
            <p className="text-sm font-medium text-destructive">Failed to load trends</p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!series || series.points.length === 0 || !seriesHasData(series)) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <CardDescription className="text-xs">
            {meta?.description ?? 'No data for the selected period'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 p-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">No orders in this period</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try broadening your date range or filters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { isCurrency, color, description } = getChartMeta(series.id, granularity);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{series.label}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="h-[240px] w-full px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            {isCurrency ? (
              <AreaChart data={series.points} margin={CHART_MARGIN}>
                <defs>
                  <linearGradient id={`gradient-${series.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <TrendChartAxes
                  isCurrency={isCurrency}
                  granularity={granularity}
                  label={series.label}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#gradient-${series.id})`}
                  animationDuration={600}
                />
              </AreaChart>
            ) : (
              <BarChart data={series.points} margin={CHART_MARGIN}>
                <TrendChartAxes
                  isCurrency={isCurrency}
                  granularity={granularity}
                  label={series.label}
                />
                <Bar
                  dataKey="value"
                  fill={color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                  animationDuration={600}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTrendChart;
