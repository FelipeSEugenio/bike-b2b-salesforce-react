import { useState, useEffect } from 'react';
import { getDashboardTrends } from '../services/dashboardService';
import type { DashboardFilters, DashboardTrends } from '../types/dashboardTypes';

export function useDashboardTrends(filters: DashboardFilters) {
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getDashboardTrends(filters);
        if (active) {
          setTrends(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading dashboard trends:', err);
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

  return { trends, loading, error };
}
