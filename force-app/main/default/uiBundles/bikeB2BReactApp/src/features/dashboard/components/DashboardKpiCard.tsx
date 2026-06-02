import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import type { DashboardSummaryKpi } from '../types/dashboardTypes';

interface DashboardKpiCardProps {
  kpi: DashboardSummaryKpi;
}

const DashboardKpiCard: React.FC<DashboardKpiCardProps> = ({ kpi }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{kpi.label}</CardDescription>
        <CardTitle className="text-2xl font-extrabold tabular-nums">
          {kpi.displayValue}
        </CardTitle>
      </CardHeader>
      {(kpi.displayDelta || kpi.helperText) && (
        <CardContent className="pt-0 text-xs text-muted-foreground">
          {kpi.displayDelta && (
            <span className="font-semibold text-foreground">{kpi.displayDelta}</span>
          )}
          {kpi.displayDelta && kpi.helperText && <span className="mx-1">·</span>}
          {kpi.helperText}
        </CardContent>
      )}
    </Card>
  );
};

export default DashboardKpiCard;
