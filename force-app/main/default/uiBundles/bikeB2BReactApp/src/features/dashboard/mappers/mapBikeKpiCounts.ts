export type DashboardBikeNode = {
  Id: string;
  Is_Active__c?: { value: boolean | null } | null;
};

export type DashboardBikeEdge = {
  node: DashboardBikeNode;
};

export function mapBikeKpiCounts(
  edges: DashboardBikeEdge[] | null | undefined
): { totalBikes: number; activeBikes: number } {
  if (!edges?.length) {
    return { totalBikes: 0, activeBikes: 0 };
  }

  const activeBikes = edges.filter((edge) => edge.node.Is_Active__c?.value === true).length;
  return {
    totalBikes: edges.length,
    activeBikes,
  };
}
