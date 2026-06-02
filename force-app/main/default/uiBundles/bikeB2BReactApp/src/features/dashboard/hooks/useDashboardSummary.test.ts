import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardSummary } from './useDashboardSummary';
import { getDashboardSummary } from '../services/dashboardService';

vi.mock('../services/dashboardService');

const mockGetDashboardSummary = vi.mocked(getDashboardSummary);

describe('useDashboardSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mocked summary structure from the service', async () => {
    const summary = {
      asOfDateISO: '2026-06-02',
      kpis: [
        {
          id: 'openOrders' as const,
          label: 'Open orders',
          displayValue: '12',
        },
      ],
    };
    mockGetDashboardSummary.mockResolvedValue(summary);

    const { result } = renderHook(() => useDashboardSummary());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetDashboardSummary).toHaveBeenCalled();
    expect(result.current.summary).toEqual(summary);
    expect(result.current.error).toBeNull();
  });
});
