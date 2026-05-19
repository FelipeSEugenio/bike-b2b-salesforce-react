export const GET_BIKES_QUERY = `
  query getBikes {
    uiapi {
      query {
        Bike__c {
          edges {
            node {
              Id
              Name {
                value
              }
              Code__c {
                value
              }
              Brand__c {
                value
              }
              Price__c {
                value
                displayValue
              }
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_ACCOUNTS_QUERY = `
  query searchAccounts($searchTerm: String!) {
    uiapi {
      query {
        Account(where: { Name: { like: $searchTerm } }) {
          edges {
            node {
              Id
              Name {
                value
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_ORDER_MUTATION = `
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

export const CREATE_ORDER_ITEM_MUTATION = `
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

export const GET_ORDERS_QUERY = `
  query getOrders {
    uiapi {
      query {
        Bike_Order__c {
          edges {
            node {
              Id
              Name {
                value
              }
              Status__c {
                value
                displayValue
              }
              Account__c {
                value
                displayValue
              }
              Total_Amount__c {
                value
                displayValue
              }
              CreatedDate {
                value
                displayValue
              }
            }
          }
        }
      }
    }
  }
`;
