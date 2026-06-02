import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useDashboardTrends } from '../hooks/useDashboardTrends';
import { renderWithRouter } from '@/test/test-utils';

vi.mock('../hooks/useDashboardSummary');
vi.mock('../hooks/useDashboardTrends');

const mockUseDashboardSummary = vi.mocked(useDashboardSummary);
const mockUseDashboardTrends = vi.mocked(useDashboardTrends);

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDashboardSummary.mockReturnValue({
      summary: {
        asOfDateISO: '2026-06-02',
        kpis: [
          {
            id: 'openOrders',
            label: 'Open orders',
            displayValue: '12',
          },
        ],
      },
      loading: false,
      error: null,
    });
    mockUseDashboardTrends.mockReturnValue({
      trends: {
        range: {
          startDateISO: '2026-05-20',
          endDateISO: '2026-06-02',
          granularity: 'day',
        },
        series: [{ id: 'orders', label: 'Orders', points: [] }],
      },
      loading: false,
      error: null,
    });
  });

  it('renders summary, trends, and filters sections', () => {
    renderWithRouter(<DashboardPage />);

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByLabelText('Summary KPIs')).toBeInTheDocument();
    expect(screen.getByLabelText('Charts and tables')).toBeInTheDocument();
    expect(screen.getByLabelText('Filters and context')).toBeInTheDocument();
    expect(screen.getByText('Open orders')).toBeInTheDocument();
  });
});
