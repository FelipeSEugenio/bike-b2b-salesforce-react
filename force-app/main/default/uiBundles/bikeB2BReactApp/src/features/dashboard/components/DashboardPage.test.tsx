import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useDashboardTrends } from '../hooks/useDashboardTrends';
import { useOrdersOverview } from '../hooks/useOrdersOverview';
import { useAccountActivity } from '../hooks/useAccountActivity';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { renderWithRouter } from '@/test/test-utils';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';
import { BIKE_ORDER_STATUS } from '../constants/orderStatuses';

vi.mock('../hooks/useDashboardFilters');
vi.mock('../hooks/useDashboardSummary');
vi.mock('../hooks/useDashboardTrends');
vi.mock('../hooks/useOrdersOverview');
vi.mock('../hooks/useAccountActivity');

const mockUseDashboardFilters = vi.mocked(useDashboardFilters);
const mockUseDashboardSummary = vi.mocked(useDashboardSummary);
const mockUseDashboardTrends = vi.mocked(useDashboardTrends);
const mockUseOrdersOverview = vi.mocked(useOrdersOverview);
const mockUseAccountActivity = vi.mocked(useAccountActivity);

const filters = getDefaultDashboardFilters();

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDashboardFilters.mockReturnValue({ filters, setFilters: vi.fn() });
    mockUseDashboardSummary.mockReturnValue({
      summary: {
        asOf: '2026-06-02T12:00:00.000Z',
        filters,
        kpis: [
          {
            id: 'totalBikes',
            label: 'Total bikes',
            value: 24,
            displayValue: '24',
          },
        ],
      },
      loading: false,
      error: null,
    });
    mockUseDashboardTrends.mockReturnValue({
      trends: {
        filters,
        granularity: 'day',
        series: [
          {
            id: 'orderCount',
            label: 'Orders',
            points: [{ date: '2026-06-01', value: 3 }],
          },
          {
            id: 'orderValue',
            label: 'Order value',
            points: [{ date: '2026-06-01', value: 1200 }],
          },
        ],
      },
      loading: false,
      error: null,
    });
    mockUseOrdersOverview.mockReturnValue({
      ordersOverview: {
        filters,
        byStatus: [
          { status: BIKE_ORDER_STATUS.DRAFT, statusValue: BIKE_ORDER_STATUS.DRAFT, count: 5 },
        ],
        recentOrders: [
          {
            orderId: '1',
            orderName: 'BO-0001',
            status: BIKE_ORDER_STATUS.SUBMITTED,
            statusValue: BIKE_ORDER_STATUS.SUBMITTED,
            accountId: null,
            accountName: null,
            orderDate: '2026-06-02',
            createdDate: '2026-06-02T12:00:00.000Z',
            totalAmount: 100,
            displayTotalAmount: '$100.00',
          },
        ],
        totals: { orderCount: 12, orderValue: 124900, displayOrderValue: '$124,900.00' },
      },
      loading: false,
      error: null,
    });
    mockUseAccountActivity.mockReturnValue({
      accountActivity: {
        filters,
        accountsWithOrders: 2,
        topAccounts: [],
      },
      loading: false,
      error: null,
    });
  });

  it('renders summary, trends, orders table, and filters sections', () => {
    renderWithRouter(<DashboardPage />);

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByLabelText('Summary KPIs')).toBeInTheDocument();
    expect(screen.getByLabelText('Charts and tables')).toBeInTheDocument();
    expect(screen.getByLabelText('Recent orders')).toBeInTheDocument();
    expect(screen.getByLabelText('Filters and context')).toBeInTheDocument();
    expect(screen.getByText('Total bikes')).toBeInTheDocument();
    expect(screen.getByText('BO-0001')).toBeInTheDocument();
  });
});
