import { executeGraphQL } from '@/api/graphqlClient';
import { SEARCH_ACCOUNTS_QUERY } from '@/api/queries';

export type AccountSummary = {
  id: string;
  name: string;
};

interface GraphQLResponse {
  uiapi: {
    query: {
      Account: {
        edges: Array<{
          node: {
            Id: string;
            Name: { value: string };
          };
        }>;
      };
    };
  };
}

export async function searchAccountsByName(term: string): Promise<AccountSummary[]> {
  if (!term || term.length < 2) {
    return [];
  }

  try {
    const data = await executeGraphQL<GraphQLResponse, { searchTerm: string }>(SEARCH_ACCOUNTS_QUERY, {
      searchTerm: `%${term}%`,
    });

    return data.uiapi.query.Account.edges.map((edge) => ({
      id: edge.node.Id,
      name: edge.node.Name.value,
    }));
  } catch (error) {
    console.error('Error searching accounts:', error);
    return [];
  }
}
