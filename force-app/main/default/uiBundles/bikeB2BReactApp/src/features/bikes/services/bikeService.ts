import { executeGraphQL } from '@/shared/api/graphqlClient';
import { GET_BIKES_QUERY } from '@/shared/api/queries';
import { Bike } from '../types';

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

export async function fetchBikes(): Promise<Bike[]> {
  const data = await executeGraphQL<GraphQLResponse, void>(GET_BIKES_QUERY);
  const edges = data.uiapi?.query?.Bike__c?.edges;

  if (!edges?.length) {
    return [];
  }

  return edges.map((edge) => ({
    id: edge.node.Id,
    name: edge.node.Name.value,
    model: edge.node.Model__c.value,
    brand: edge.node.Brand__c.value,
    price: edge.node.Price__c.value,
    displayPrice: edge.node.Price__c.displayValue,
    imageUrl: edge.node.Image_URL__c?.value
  }));
}
