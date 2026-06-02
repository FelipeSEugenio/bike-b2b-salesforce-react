import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';

const DashboardFiltersPanel: React.FC = () => {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-base">Filters & context</CardTitle>
        <CardDescription>
          {/* TODO: Wire date range, account, and status filters. */}
          Structural placeholder for dashboard filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dashboard-date-range">Date range</Label>
          <div
            id="dashboard-date-range"
            className="h-9 rounded-md border border-border bg-muted/30 px-3 text-xs leading-9 text-muted-foreground"
          >
            Last 14 days (mock)
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dashboard-account">Account</Label>
          <div
            id="dashboard-account"
            className="h-9 rounded-md border border-border bg-muted/30 px-3 text-xs leading-9 text-muted-foreground"
          >
            All accounts (mock)
          </div>
        </div>
        <div className="space-y-2">
          <Label>Order status</Label>
          <div className="flex flex-wrap gap-2">
            {['Draft', 'Submitted', 'Approved'].map((status) => (
              <span
                key={status}
                className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {status}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFiltersPanel;
