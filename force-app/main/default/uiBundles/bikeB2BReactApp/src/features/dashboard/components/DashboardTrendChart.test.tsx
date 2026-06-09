import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardTrendChart from './DashboardTrendChart';
import type { TrendSeries } from '../types/dashboardTypes';

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: 400, height: 240 }}>
        {children}
      </div>
    ),
  };
});

const orderCountSeries: TrendSeries = {
  id: 'orderCount',
  label: 'Orders',
  points: [
    { date: '2026-06-01', value: 2 },
    { date: '2026-06-02', value: 0 },
    { date: '2026-06-03', value: 1 },
  ],
};

const orderValueSeries: TrendSeries = {
  id: 'orderValue',
  label: 'Order value',
  points: [
    { date: '2026-06-01', value: 300 },
    { date: '2026-06-02', value: 0 },
    { date: '2026-06-03', value: 500 },
  ],
};

describe('DashboardTrendChart', () => {
  it('renders stable card titles while loading', () => {
    render(<DashboardTrendChart chartId="orderCount" series={null} loading />);

    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('renders a per-card error state', () => {
    render(
      <DashboardTrendChart
        chartId="orderValue"
        series={null}
        error="Network unavailable"
      />
    );

    expect(screen.getByText('Order value')).toBeInTheDocument();
    expect(screen.getByText('Failed to load trends')).toBeInTheDocument();
    expect(screen.getByText('Network unavailable')).toBeInTheDocument();
  });

  it('shows a no-data state when all values are zero', () => {
    render(
      <DashboardTrendChart
        series={{
          id: 'orderCount',
          label: 'Orders',
          points: [
            { date: '2026-06-01', value: 0 },
            { date: '2026-06-02', value: 0 },
          ],
        }}
      />
    );

    expect(screen.getByText('No orders in this period')).toBeInTheDocument();
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });

  it('renders charts for orders and order value series', () => {
    const { rerender } = render(<DashboardTrendChart series={orderCountSeries} granularity="day" />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByText('Daily order volume for the selected period')).toBeInTheDocument();

    rerender(<DashboardTrendChart series={orderValueSeries} granularity="week" />);
    expect(screen.getByText('Weekly order value for the selected period')).toBeInTheDocument();
  });
});
