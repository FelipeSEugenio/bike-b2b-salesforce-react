import { executeGraphQL } from '@/shared/api/graphqlClient';
import { CREATE_ORDER_MUTATION, CREATE_ORDER_ITEM_MUTATION } from '@/shared/api/queries';
import { CreateOrderInput } from '../types';

interface CreateOrderResponse {
  uiapi: {
    Bike_Order__cCreate: {
      Record: {
        Id: string;
      };
    };
  };
}

interface CreateOrderItemResponse {
  uiapi: {
    Bike_Order_Item__cCreate: {
      Record: {
        Id: string;
      };
    };
  };
}

export async function createOrderWithItems(input: CreateOrderInput): Promise<{ orderId: string }> {
  // 1. Create the Order
  const orderResponse = await executeGraphQL<CreateOrderResponse, any>(CREATE_ORDER_MUTATION, {
    input: {
      Bike_Order__c: {
        Account__c: input.accountId,
        Status__c: input.status,
        Order_Date__c: new Date().toISOString().split('T')[0] // Set today's date
      }
    }
  });

  const orderId = orderResponse.uiapi.Bike_Order__cCreate.Record.Id;

  // 2. Create the Items
  const itemPromises = input.items.map(item => {
    return executeGraphQL<CreateOrderItemResponse, any>(CREATE_ORDER_ITEM_MUTATION, {
      input: {
        Bike_Order_Item__c: {
          Bike_Order__c: orderId,
          Bike__c: item.bikeId,
          Quantity__c: item.quantity,
          Unit_Price__c: item.unitPrice
        }
      }
    });
  });

  await Promise.all(itemPromises);

  return { orderId };
}
