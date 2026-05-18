import { executeGraphQL } from '@/api/graphqlClient';

export type DraftOrderItemInput = {
  bikeId: string;
  name: string;
  code: string;
  brand: string;
  unitPrice: number;
  quantity: number;
};

export type CreateOrderInput = {
  accountId: string;
  status: string;
  items: DraftOrderItemInput[];
  totalAmount: number;
};

const CREATE_ORDER_MUTATION = `
  mutation createOrder($input: RecordCreateInput!) {
    uiapi {
      recordCreate(input: $input) {
        record {
          Id
        }
      }
    }
  }
`;

const CREATE_ORDER_ITEM_MUTATION = `
  mutation createOrderItem($input: RecordCreateInput!) {
    uiapi {
      recordCreate(input: $input) {
        record {
          Id
        }
      }
    }
  }
`;

interface CreateRecordResponse {
  uiapi: {
    recordCreate: {
      record: {
        Id: string;
      };
    };
  };
}

export async function createOrderWithItems(input: CreateOrderInput): Promise<{ orderId: string }> {
  // 1. Create the Order
  const orderResponse = await executeGraphQL<CreateRecordResponse, any>(CREATE_ORDER_MUTATION, {
    input: {
      apiName: 'Bike_Order__c',
      fields: {
        Account__c: input.accountId,
        Status__c: input.status,
        Order_Date__c: new Date().toISOString().split('T')[0] // Set today's date
      }
    }
  });

  const orderId = orderResponse.uiapi.recordCreate.record.Id;

  // 2. Create the Items
  // We perform these sequentially or in parallel. Parallel is faster.
  const itemPromises = input.items.map(item => {
    return executeGraphQL<CreateRecordResponse, any>(CREATE_ORDER_ITEM_MUTATION, {
      input: {
        apiName: 'Bike_Order_Item__c',
        fields: {
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
