import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountLookup from './AccountLookup';
import { useAccountSearch } from '../hooks/useAccountSearch';
import type { AccountSummary } from '../types';

const searchInput = () => screen.getByPlaceholderText('Search account by name...');

vi.mock('../hooks/useAccountSearch');

const mockUseAccountSearch = vi.mocked(useAccountSearch);

const acmeAccount: AccountSummary = { id: '001', name: 'Acme Corp' };
const globexAccount: AccountSummary = { id: '002', name: 'Globex' };

function renderLookup(props?: Partial<React.ComponentProps<typeof AccountLookup>>) {
  const onChange = vi.fn();
  const result = render(
    <AccountLookup
      value={props?.value ?? null}
      onChange={props?.onChange ?? onChange}
      disabled={props?.disabled}
    />,
  );
  return { onChange, ...result };
}

describe('AccountLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAccountSearch.mockReturnValue({
      suggestions: [],
      isSearching: false,
    });
  });

  it('shows loading state while searching', async () => {
    mockUseAccountSearch.mockReturnValue({
      suggestions: [],
      isSearching: true,
    });

    const user = userEvent.setup();
    renderLookup();

    await user.type(searchInput(), 'ac');

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows matching accounts and selects one', async () => {
    mockUseAccountSearch.mockReturnValue({
      suggestions: [acmeAccount, globexAccount],
      isSearching: false,
    });

    const user = userEvent.setup();
    const { onChange } = renderLookup();

    await user.type(searchInput(), 'ac');

    await user.click(screen.getByRole('button', { name: 'Acme Corp' }));

    expect(onChange).toHaveBeenCalledWith(acmeAccount);
    expect(searchInput()).toHaveValue('Acme Corp');
  });

  it('shows empty state when no accounts match', async () => {
    mockUseAccountSearch.mockReturnValue({
      suggestions: [],
      isSearching: false,
    });

    const user = userEvent.setup();
    renderLookup();

    await user.type(searchInput(), 'zz');

    expect(screen.getByText('No accounts found')).toBeInTheDocument();
  });

  it('shows empty state when search fails (no suggestions returned)', async () => {
    mockUseAccountSearch.mockReturnValue({
      suggestions: [],
      isSearching: false,
    });

    const user = userEvent.setup();
    renderLookup();

    await user.type(searchInput(), 'er');

    expect(screen.getByText('No accounts found')).toBeInTheDocument();
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
  });

  it('clears the selected account', async () => {
    const user = userEvent.setup();
    const { onChange } = renderLookup({ value: acmeAccount });

    await user.click(screen.getByRole('button'));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(searchInput()).toHaveValue('');
  });
});
