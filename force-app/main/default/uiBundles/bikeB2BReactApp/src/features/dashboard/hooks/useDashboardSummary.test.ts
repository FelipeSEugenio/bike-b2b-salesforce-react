import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardSummary } from './useDashboardSummary';
import { getDashboardSummary } from '../services/dashboardService';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';

vi.mock('../services/dashboardService');

const mockGetDashboardSummary = vi.mocked(getDashboardSummary);

describe('useDashboardSummary', () => {
  const filters = getDefaultDashboardFilters();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mocked summary contract from the service', async () => {
    const summary = {
      asOf: '2026-06-02T12:00:00.000Z',
      filters,
      kpis: [
        {
          id: 'totalBikes' as const,
          label: 'Total bikes',
          value: 24,
          displayValue: '24',
        },
      ],
    };
    mockGetDashboardSummary.mockResolvedValue(summary);

    const { result } = renderHook(() => useDashboardSummary(filters));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetDashboardSummary).toHaveBeenCalledWith(filters);
    expect(result.current.summary).toEqual(summary);
    expect(result.current.summary?.kpis[0]?.value).toBe(24);
    expect(result.current.error).toBeNull();
  });
});
