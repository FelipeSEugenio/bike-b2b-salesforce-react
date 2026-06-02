import { useState, useEffect } from 'react';
import { getOrdersOverview } from '../services/dashboardService';
import type { DashboardFilters, OrdersOverview } from '../types/dashboardTypes';

export function useOrdersOverview(filters: DashboardFilters) {
  const [ordersOverview, setOrdersOverview] = useState<OrdersOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getOrdersOverview(filters);
        if (active) {
          setOrdersOverview(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading orders overview:', err);
        if (active) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [filters.dateRange.startDate, filters.dateRange.endDate, filters.accountId]);

  return { ordersOverview, loading, error };
}
