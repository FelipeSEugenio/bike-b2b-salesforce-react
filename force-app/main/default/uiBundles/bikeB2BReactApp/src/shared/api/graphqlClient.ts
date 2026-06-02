/**
 * Thin GraphQL client: createDataSDK + sdk.graphql with centralized error handling.
 * Use with gql-tagged queries and generated operation types for type-safe calls.
 */
import { createDataSDK } from '@salesforce/sdk-data';

type GraphQLErrorLike = {
  message: string;
  path?: ReadonlyArray<string | number>;
  extensions?: Record<string, unknown>;
};

type GraphQLResponseLike<TData> = {
  data?: TData | null;
  errors?: GraphQLErrorLike[];
};

function formatGraphQLErrors(errors: GraphQLErrorLike[]): string {
  return errors
    .map((error) => {
      const path = error.path?.length ? ` [path: ${error.path.join('.')}]` : '';
      const errorType =
        typeof error.extensions?.ErrorType === 'string'
          ? ` (${error.extensions.ErrorType})`
          : '';
      return `${error.message}${errorType}${path}`;
    })
    .join('; ');
}

function toGraphQLError(item: unknown): GraphQLErrorLike {
  if (item && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    const message =
      typeof record.message === 'string'
        ? record.message
        : JSON.stringify(item);
    const errorCode =
      typeof record.errorCode === 'string' ? record.errorCode : undefined;
    return {
      message: errorCode ? `${errorCode}: ${message}` : message,
      path: Array.isArray(record.path) ? (record.path as GraphQLErrorLike['path']) : undefined,
      extensions: record,
    };
  }
  return { message: String(item) };
}

/**
 * Normalizes SDK / HTTP payloads into `{ data, errors }`.
 * - Standard GraphQL: `{ data, errors }`
 * - Salesforce REST 4xx body: `[{ message, errorCode, ... }]`
 * - Unwrapped success payload: `{ uiapi: ... }`
 */
function normalizeGraphQLResponse<TData>(raw: unknown): GraphQLResponseLike<TData> {
  if (raw == null) {
    return { data: null, errors: [{ message: 'GraphQL response was empty' }] };
  }

  if (Array.isArray(raw)) {
    return { data: null, errors: raw.map(toGraphQLError) };
  }

  if (typeof raw === 'object') {
    const record = raw as Record<string, unknown>;

    if ('data' in record || 'errors' in record) {
      const errors = Array.isArray(record.errors)
        ? record.errors.map(toGraphQLError)
        : undefined;
      return {
        data: (record.data as TData | null | undefined) ?? null,
        errors,
      };
    }

    if ('uiapi' in record) {
      return { data: raw as TData };
    }
  }

  return {
    data: null,
    errors: [{ message: 'Unexpected GraphQL response shape', extensions: { raw } }],
  };
}

function logGraphQLErrors(errors: GraphQLErrorLike[], context: string): void {
  console.error(`[GraphQL] ${context}:`, errors);
  console.error(`[GraphQL] ${context} (detail):`, JSON.stringify(errors, null, 2));
}

/**
 * @salesforce/sdk-data expects `graphql({ query, variables?, operationName? })`.
 * The POST body is `{ query, variables, operationName }` with JSON content-type.
 */
export async function executeGraphQL<TData, TVariables>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const sdk = await createDataSDK();
  if (!sdk.graphql) {
    throw new Error('GraphQL is not supported in this environment or SDK initialization failed.');
  }

  const raw = await sdk.graphql<TData, TVariables>({
    query,
    ...(variables !== undefined ? { variables } : {}),
  });

  const response = normalizeGraphQLResponse<TData>(raw);

  if (response.errors?.length) {
    logGraphQLErrors(response.errors, 'request failed or returned errors');
    const msg = formatGraphQLErrors(response.errors);
    if (response.data != null) {
      return response.data;
    }
    throw new Error(`GraphQL Error: ${msg}`);
  }

  if (response.data == null) {
    console.error('[GraphQL] Response missing data payload:', JSON.stringify(raw, null, 2));
    throw new Error('GraphQL response returned no data.');
  }

  return response.data;
}
