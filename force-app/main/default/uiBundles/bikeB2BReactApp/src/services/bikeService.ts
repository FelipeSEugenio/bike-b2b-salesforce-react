import { executeGraphQL } from '@/api/graphqlClient';
import { useState, useEffect } from 'react';
import { GET_BIKES_QUERY } from '@/api/queries';

export type Bike = {
  id: string;
  name: string;
  model: string;
  brand: string;
  price: number;
  displayPrice?: string;
  imageUrl?: string;
};

interface GraphQLResponse {
  uiapi: {
    query: {
      Bike__c: {
        edges: Array<{
          node: {
            Id: string;
            Name: { value: string };
            Model__c: { value: string };
            Brand__c: { value: string };
            Price__c: { value: number; displayValue: string };
            Image_URL__c?: { value: string };
          };
        }>;
      };
    };
  };
}

export function useBikeCatalog() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBikes() {
      try {
        setLoading(true);
        const data = await executeGraphQL<GraphQLResponse, void>(GET_BIKES_QUERY);
        
        const mappedBikes: Bike[] = data.uiapi.query.Bike__c.edges.map(edge => ({
          id: edge.node.Id,
          name: edge.node.Name.value,
          model: edge.node.Model__c.value,
          brand: edge.node.Brand__c.value,
          price: edge.node.Price__c.value,
          displayPrice: edge.node.Price__c.displayValue,
          imageUrl: edge.node.Image_URL__c?.value
        }));

        setBikes(mappedBikes);
        setError(null);
      } catch (err) {
        console.error('Error fetching bikes:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBikes();
  }, []);

  return { bikes, loading, error };
}
