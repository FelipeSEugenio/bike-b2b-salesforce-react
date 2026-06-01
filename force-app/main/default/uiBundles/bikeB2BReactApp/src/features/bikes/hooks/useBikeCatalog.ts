import { useState, useEffect } from 'react';
import { fetchBikes } from '../services/bikeService';
import { Bike } from '../types';

export function useBikeCatalog() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadBikes() {
      try {
        setLoading(true);
        const data = await fetchBikes();
        if (active) {
          setBikes(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching bikes:', err);
        if (active) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBikes();
    return () => {
      active = false;
    };
  }, []);

  return { bikes, loading, error };
}
