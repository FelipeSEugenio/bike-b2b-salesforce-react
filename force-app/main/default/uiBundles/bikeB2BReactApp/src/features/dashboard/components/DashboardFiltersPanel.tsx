import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { DASHBOARD_FILTER_STATUS_OPTIONS } from '../constants/orderStatuses';
import type { AccountActivity, DashboardFilters } from '../types/dashboardTypes';

interface DashboardFiltersPanelProps {
  filters: DashboardFilters;
  accountActivity: AccountActivity | null;
}

const DashboardFiltersPanel: React.FC<DashboardFiltersPanelProps> = ({
  filters,
  accountActivity,
}) => {
  const { dateRange } = filters;
  const dateLabel =
    dateRange.preset === 'last30'
      ? 'Last 30 days'
      : dateRange.preset === 'last7'
        ? 'Last 7 days'
        : `${dateRange.startDate} – ${dateRange.endDate}`;

  return (
    <div className="space-y-4">
      <Card className="lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="text-base">Filters & context</CardTitle>
          <CardDescription>
            {/* TODO: Wire interactive date range, account lookup, status multi-select. */}
            Mocked filter state for GraphQL phase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dashboard-date-range">Date range</Label>
            <div
              id="dashboard-date-range"
              className="h-9 rounded-md border border-border bg-muted/30 px-3 text-xs leading-9 text-muted-foreground"
            >
              {dateLabel}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dashboard-account">Account</Label>
            <div
              id="dashboard-account"
              className="h-9 rounded-md border border-border bg-muted/30 px-3 text-xs leading-9 text-muted-foreground"
            >
              {filters.accountId ? filters.accountId : 'All accounts'}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Order status</Label>
            <div className="flex flex-wrap gap-2">
              {DASHBOARD_FILTER_STATUS_OPTIONS.map((status) => (
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

      {accountActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account activity</CardTitle>
            <CardDescription>
              {accountActivity.accountsWithOrders} accounts with orders in period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {accountActivity.topAccounts.map((account) => (
              <div
                key={account.accountId}
                className="flex justify-between gap-2 text-xs border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <span className="font-semibold text-foreground truncate">
                  {account.accountName}
                </span>
                <span className="text-muted-foreground shrink-0">
                  {account.orderCountInPeriod} orders ·{' '}
                  {account.displayLastOrderTotal ?? account.lastOrderTotal}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardFiltersPanel;
