import React from 'react';
import { useOrders } from '@/services/orderService';

const OrdersPage: React.FC = () => {
  const { orders, loading, error } = useOrders();

  const getStatusStyle = (status: string) => {
    const normalized = status?.toLowerCase() || '';
    switch (normalized) {
      case 'submitted':
      case 'activated':
      case 'approved':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20';
      case 'draft':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Orders</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">Track and manage your bike B2B purchase orders.</p>
      </header>

      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-muted-foreground text-sm font-medium">Loading orders...</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-card border border-border rounded-lg p-5 flex justify-between items-center animate-pulse">
                <div className="space-y-2.5 py-1 flex-grow">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex gap-3 text-destructive">
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="text-sm font-medium">
            Something went wrong while loading orders: <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center shadow-sm">
          <p className="text-muted-foreground text-base">No orders found.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all duration-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-4.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</th>
                    <th className="px-6 py-4.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-foreground">{order.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{order.accountName || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-foreground">
                          {order.displayTotalAmount || (order.totalAmount !== null ? `$${order.totalAmount.toFixed(2)}` : '—')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-muted-foreground">
                          {order.displayCreatedDate || new Date(order.createdDate).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col gap-3 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-foreground">{order.name}</span>
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs border-t border-border pt-3">
                  <div>
                    <span className="text-muted-foreground block font-medium">Account</span>
                    <span className="text-foreground font-semibold truncate block">{order.accountName || '—'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block font-medium">Total</span>
                    <span className="text-foreground font-bold block">
                      {order.displayTotalAmount || (order.totalAmount !== null ? `$${order.totalAmount.toFixed(2)}` : '—')}
                    </span>
                  </div>
                  <div className="col-span-2 text-muted-foreground mt-1 text-[11px]">
                    Created on {order.displayCreatedDate || new Date(order.createdDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
