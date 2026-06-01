import { executeGraphQL } from '@/shared/api/graphqlClient';
import { GET_ORDERS_QUERY } from '@/shared/api/queries';
import { Order } from '../types';

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

export async function fetchOrders(): Promise<Order[]> {
  const data = await executeGraphQL<GraphQLResponse, void>(GET_ORDERS_QUERY);
  
  return data.uiapi.query.Bike_Order__c.edges.map(edge => ({
    id: edge.node.Id,
    name: edge.node.Name.value,
    status: edge.node.Status__c.displayValue || edge.node.Status__c.value,
    accountName: edge.node.Account__c.displayValue || null,
    totalAmount: edge.node.Total_Amount__c.value,
    displayTotalAmount: edge.node.Total_Amount__c.displayValue,
    createdDate: edge.node.CreatedDate.value,
    displayCreatedDate: edge.node.CreatedDate.displayValue
  }));
}
