import { useState, useEffect } from 'react';
import { getDashboardTrends } from '../services/dashboardService';
import type { DashboardTrends } from '../types/dashboardTypes';

export function useDashboardTrends() {
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getDashboardTrends();
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
  }, []);

  return { trends, loading, error };
}
