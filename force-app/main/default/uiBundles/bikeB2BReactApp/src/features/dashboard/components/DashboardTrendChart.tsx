import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import type { TrendSeries } from '../types/dashboardTypes';

interface DashboardTrendChartProps {
  series: TrendSeries | null;
  loading?: boolean;
  error?: string | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const DashboardTrendChart: React.FC<DashboardTrendChartProps> = ({
  series,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive text-sm">Trend Error</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-[200px] items-center justify-center text-xs text-destructive text-center p-6">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!series || series.points.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{series?.label ?? 'Trends'}</CardTitle>
          <CardDescription>No data points for this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground"
            aria-hidden
          >
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCurrency = series.id === 'orderValue';
  const color = isCurrency ? 'var(--color-chart-2)' : 'var(--color-chart-1)';

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{series.label}</CardTitle>
        <CardDescription className="text-xs">
          {isCurrency ? 'Total value' : 'Order volume'} over selected period
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series.points}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`gradient-${series.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
                tickFormatter={(val) => (isCurrency ? `$${val / 1000}k` : val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  color: 'var(--color-foreground)',
                }}
                itemStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
                labelFormatter={formatDate}
                formatter={(value: number) => [
                  isCurrency ? formatCurrency(value) : value,
                  series.label,
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${series.id})`}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTrendChart;
