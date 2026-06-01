/**
 * Thin GraphQL client: createDataSDK + data.graphql with centralized error handling.
 * Use with gql-tagged queries and generated operation types for type-safe calls.
 */
import { createDataSDK } from '@salesforce/sdk-data';

export async function executeGraphQL<TData, TVariables>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const sdk = await createDataSDK();
  if (!sdk.graphql) {
    throw new Error('GraphQL is not supported in this environment or SDK initialization failed.');
  }
  const response = await sdk.graphql<TData, TVariables>({ query, variables });

  console.log('GraphQL raw response:', JSON.stringify(response, null, 2));

  if (response.errors && response.errors.length > 0) {
    const msg = response.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL Error: ${msg}`);
  }

  if (!response.data) {
    throw new Error('GraphQL response returned no data.');
  }

  return response.data;
}
