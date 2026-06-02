import { describe, it, expect } from 'vitest';
import { mapBikeKpiCounts } from './mapBikeKpiCounts';

describe('mapBikeKpiCounts', () => {
  it('returns zero counts for empty edges', () => {
    expect(mapBikeKpiCounts([])).toEqual({ totalBikes: 0, activeBikes: 0 });
    expect(mapBikeKpiCounts(undefined)).toEqual({ totalBikes: 0, activeBikes: 0 });
  });

  it('counts total bikes and only Is_Active__c = true as active', () => {
    const edges = [
      { node: { Id: '1', Is_Active__c: { value: true } } },
      { node: { Id: '2', Is_Active__c: { value: false } } },
      { node: { Id: '3', Is_Active__c: { value: true } } },
      { node: { Id: '4', Is_Active__c: null } },
    ];
    expect(mapBikeKpiCounts(edges)).toEqual({ totalBikes: 4, activeBikes: 2 });
  });
});
