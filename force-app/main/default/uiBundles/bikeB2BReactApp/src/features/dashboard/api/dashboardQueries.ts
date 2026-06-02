/** Dashboard-only Bike__c query — minimal fields for catalog KPI counts. */
export const GET_DASHBOARD_BIKES_QUERY = `
  query getDashboardBikes {
    uiapi {
      query {
        Bike__c {
          edges {
            node {
              Id
              Is_Active__c {
                value
              }
            }
          }
        }
      }
    }
  }
`;

/** Bike_Order__c rows in dashboard date range — KPI + overview aggregation. */
export const GET_DASHBOARD_ORDERS_QUERY = `
  query getDashboardOrders($startDate: DateInput!, $endDate: DateInput!) {
    uiapi {
      query {
        Bike_Order__c(
          first: 500
          orderBy: { Order_Date__c: { order: DESC } }
          where: {
            and: [
              { Order_Date__c: { gte: $startDate } }
              { Order_Date__c: { lte: $endDate } }
            ]
          }
        ) {
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
              Order_Date__c {
                value
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
