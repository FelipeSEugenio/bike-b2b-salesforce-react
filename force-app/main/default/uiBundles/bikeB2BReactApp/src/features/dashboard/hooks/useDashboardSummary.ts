import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import type { DashboardSummary } from '../types/dashboardTypes';

export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getDashboardSummary();
        if (active) {
          setSummary(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading dashboard summary:', err);
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

  return { summary, loading, error };
}
