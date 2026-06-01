import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatalogPage from './CatalogPage';
import { useBikeCatalog } from '../hooks/useBikeCatalog';
import { useOrderMutation } from '@/features/orders/hooks/useOrderMutation';
import { renderWithRouter } from '@/test/test-utils';
import type { Bike } from '../types';

vi.mock('../hooks/useBikeCatalog');
vi.mock('@/features/orders/hooks/useOrderMutation');

const mockUseBikeCatalog = vi.mocked(useBikeCatalog);
const mockUseOrderMutation = vi.mocked(useOrderMutation);

const sampleBikes: Bike[] = [
  {
    id: 'bike-1',
    name: 'Mountain Pro',
    model: 'MP-100',
    brand: 'Trek',
    price: 1200,
  },
  {
    id: 'bike-2',
    name: 'City Rider',
    model: 'CR-50',
    brand: 'Specialized',
    price: 800,
  },
];

const defaultMutationState = {
  createOrder: vi.fn().mockResolvedValue({ success: true, orderId: 'order-1' }),
  isCreating: false,
  createError: null,
  createSuccess: null,
  clearStatus: vi.fn(),
};

describe('CatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOrderMutation.mockReturnValue(defaultMutationState);
  });

  it('renders the catalog with bikes', () => {
    mockUseBikeCatalog.mockReturnValue({
      bikes: sampleBikes,
      loading: false,
      error: null,
    });

    renderWithRouter(<CatalogPage />);

    expect(screen.getByRole('heading', { name: 'Bike Catalog' })).toBeInTheDocument();

    const catalogTable = screen.getByRole('table');
    expect(within(catalogTable).getByText('Mountain Pro')).toBeInTheDocument();
    expect(within(catalogTable).getByText('City Rider')).toBeInTheDocument();
  });

  it('shows loading state while fetching bikes', () => {
    mockUseBikeCatalog.mockReturnValue({
      bikes: [],
      loading: true,
      error: null,
    });

    renderWithRouter(<CatalogPage />);

    expect(screen.getByText('Loading catalog...')).toBeInTheDocument();
  });

  it('shows error message when catalog fails to load', () => {
    mockUseBikeCatalog.mockReturnValue({
      bikes: [],
      loading: false,
      error: 'Network error',
    });

    renderWithRouter(<CatalogPage />);

    expect(
      screen.getByText(/something went wrong while loading the catalog/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows empty catalog message when there are no bikes', () => {
    mockUseBikeCatalog.mockReturnValue({
      bikes: [],
      loading: false,
      error: null,
    });

    renderWithRouter(<CatalogPage />);

    expect(screen.getByText('No bikes found in the catalog.')).toBeInTheDocument();
  });

  it('filters bikes by search text', async () => {
    mockUseBikeCatalog.mockReturnValue({
      bikes: sampleBikes,
      loading: false,
      error: null,
    });

    const user = userEvent.setup();
    renderWithRouter(<CatalogPage />);

    await user.type(screen.getByLabelText('Search'), 'Mountain');

    const catalogTable = screen.getByRole('table');
    expect(within(catalogTable).getByText('Mountain Pro')).toBeInTheDocument();
    expect(within(catalogTable).queryByText('City Rider')).not.toBeInTheDocument();
  });

  it('filters bikes by brand', async () => {
    mockUseBikeCatalog.mockReturnValue({
      bikes: sampleBikes,
      loading: false,
      error: null,
    });

    const user = userEvent.setup();
    renderWithRouter(<CatalogPage />);

    await user.selectOptions(screen.getByLabelText('Brand'), 'Specialized');

    const catalogTable = screen.getByRole('table');
    expect(within(catalogTable).getByText('City Rider')).toBeInTheDocument();
    expect(within(catalogTable).queryByText('Mountain Pro')).not.toBeInTheDocument();
  });

  it('adds a bike to the draft order', async () => {
    mockUseBikeCatalog.mockReturnValue({
      bikes: sampleBikes,
      loading: false,
      error: null,
    });

    const user = userEvent.setup();
    renderWithRouter(<CatalogPage />);

    const addButtons = screen.getAllByRole('button', { name: /add to order/i });
    await user.click(addButtons[0]!);

    expect(screen.queryByText(/your order is empty/i)).not.toBeInTheDocument();
    expect(screen.getByTitle('Remove item')).toBeInTheDocument();
  });
});
