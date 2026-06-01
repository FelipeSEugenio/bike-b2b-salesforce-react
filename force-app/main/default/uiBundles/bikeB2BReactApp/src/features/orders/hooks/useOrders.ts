import { useState, useEffect } from 'react';
import { fetchOrders } from '../services/orderService';
import { Order } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await fetchOrders();
        if (active) {
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (active) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  return { orders, loading, error };
}
