import { useState, useEffect } from 'react';
import { getAccountActivity } from '../services/dashboardService';
import type { AccountActivity, DashboardFilters } from '../types/dashboardTypes';

export function useAccountActivity(filters: DashboardFilters) {
  const [accountActivity, setAccountActivity] = useState<AccountActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getAccountActivity(filters);
        if (active) {
          setAccountActivity(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading account activity:', err);
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
  }, [filters]);

  return { accountActivity, loading, error };
}
