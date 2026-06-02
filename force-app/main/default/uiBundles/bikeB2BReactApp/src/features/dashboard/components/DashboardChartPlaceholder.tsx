import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import type { DashboardTrendSeries } from '../types/dashboardTypes';

interface DashboardChartPlaceholderProps {
  series: DashboardTrendSeries;
}

const DashboardChartPlaceholder: React.FC<DashboardChartPlaceholderProps> = ({
  series,
}) => {
  const pointCount = series.points.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{series.label}</CardTitle>
        <CardDescription>
          {/* TODO: Replace with chart library (e.g. orders/revenue over time). */}
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
