import { executeGraphQL } from '@/api/graphqlClient';
import { GET_ORDERS_QUERY } from '@/api/queries';
import { useState, useEffect } from 'react';

export type Order = {
  id: string;
  name: string;
  status: string;
  accountName: string | null;
  totalAmount: number | null;
  displayTotalAmount?: string;
  createdDate: string;
  displayCreatedDate?: string;
};

interface GraphQLResponse {
  uiapi: {
    query: {
      Bike_Order__c: {
        edges: Array<{
          node: {
            Id: string;
            Name: { value: string };
            Status__c: { value: string; displayValue: string };
            Account__c: { value: string; displayValue: string };
            Total_Amount__c: { value: number; displayValue: string };
            CreatedDate: { value: string; displayValue: string };
          };
        }>;
      };
    };
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await executeGraphQL<GraphQLResponse, void>(GET_ORDERS_QUERY);
        
        const mappedOrders: Order[] = data.uiapi.query.Bike_Order__c.edges.map(edge => ({
          id: edge.node.Id,
          name: edge.node.Name.value,
          status: edge.node.Status__c.displayValue || edge.node.Status__c.value,
          accountName: edge.node.Account__c.displayValue || null,
          totalAmount: edge.node.Total_Amount__c.value,
          displayTotalAmount: edge.node.Total_Amount__c.displayValue,
          createdDate: edge.node.CreatedDate.value,
          displayCreatedDate: edge.node.CreatedDate.displayValue
        }));

        setOrders(mappedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return { orders, loading, error };
}
