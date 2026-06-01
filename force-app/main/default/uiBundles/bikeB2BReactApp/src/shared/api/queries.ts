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
              Model__c {
                value
              }
              Brand__c {
                value
              }
              Price__c {
                value
                displayValue
              }
              Image_URL__c {
                value
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
  mutation createOrder($input: Bike_Order__cCreateInput!) {
    uiapi {
      Bike_Order__cCreate(input: $input) {
        Record {
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
        }
      }
    }
  }
`;

export const CREATE_ORDER_ITEM_MUTATION = `
  mutation createOrderItem($input: Bike_Order_Item__cCreateInput!) {
    uiapi {
      Bike_Order_Item__cCreate(input: $input) {
        Record {
          Id
          Bike_Order__c {
            value
          }
          Bike__c {
            value
          }
          Quantity__c {
            value
          }
          Unit_Price__c {
            value
            displayValue
          }
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
