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

interface DashboardChartPlaceholderProps {
  series: TrendSeries | null;
  loading?: boolean;
  error?: string | null;
}

const DashboardChartPlaceholder: React.FC<DashboardChartPlaceholderProps> = ({
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

  const pointCount = series.points.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{series.label}</CardTitle>
        <CardDescription>
          {/* TODO: Replace with chart library wired to TrendSeries points. */}
          Placeholder — {pointCount} data points loaded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground"
          aria-hidden
        >
          Chart area ({series.id})
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChartPlaceholder;
