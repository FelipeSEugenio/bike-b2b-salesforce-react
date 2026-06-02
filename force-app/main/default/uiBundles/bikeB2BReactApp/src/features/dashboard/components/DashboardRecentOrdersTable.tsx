import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import type { OrdersOverview } from '../types/dashboardTypes';

interface DashboardRecentOrdersTableProps {
  ordersOverview: OrdersOverview | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const DashboardRecentOrdersTable: React.FC<DashboardRecentOrdersTableProps> = ({
  ordersOverview,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="h-10 bg-muted/30 border-b border-border" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-medium text-destructive mb-3">
          Failed to load recent orders: {error}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (!ordersOverview || ordersOverview.recentOrders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/10 p-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">No orders found for this period.</p>
        <p className="text-xs text-muted-foreground mt-1">Try broadening your date range or filters.</p>
      </div>
    );
  }

  const { recentOrders, byStatus, totals } = ordersOverview;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {byStatus.map((bucket) => (
          <span
            key={bucket.statusValue}
            className="inline-flex rounded-full border border-border bg-muted/30 px-2.5 py-1 font-medium"
          >
            {bucket.status}: {bucket.count}
          </span>
        ))}
        <span className="inline-flex items-center font-semibold text-foreground">
          Period total: {totals.displayOrderValue ?? totals.orderValue}
        </span>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 text-sm font-semibold text-foreground">
                    {order.orderName}
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{order.status}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {order.accountName ?? '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-bold text-foreground">
                    {order.displayTotalAmount ??
                      (order.totalAmount != null ? `$${order.totalAmount.toFixed(2)}` : '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardRecentOrdersTable;
