import React from 'react';
import type { OrdersOverview } from '../types/dashboardTypes';

interface DashboardRecentOrdersTableProps {
  ordersOverview: OrdersOverview;
}

const DashboardRecentOrdersTable: React.FC<DashboardRecentOrdersTableProps> = ({
  ordersOverview,
}) => {
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
