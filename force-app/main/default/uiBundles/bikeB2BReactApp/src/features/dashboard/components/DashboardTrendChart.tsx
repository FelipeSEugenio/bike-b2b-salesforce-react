import React from 'react';
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{series.label}</CardTitle>
        <CardDescription>
          Showing {series.label.toLowerCase()} distribution over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center"
          aria-hidden
        >
          <p className="text-sm font-medium text-foreground">Trend Visualization</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {series.points.length} data points available for the selected period.
          </p>
          <div className="mt-4 flex gap-1 items-end h-12">
            {/* Minimal intentional-looking bar preview */}
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="w-2 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTrendChart;
