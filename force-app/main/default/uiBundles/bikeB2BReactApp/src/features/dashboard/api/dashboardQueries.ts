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
