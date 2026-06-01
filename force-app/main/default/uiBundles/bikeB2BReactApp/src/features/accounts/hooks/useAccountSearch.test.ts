import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccountSearch } from './useAccountSearch';
import { searchAccountsByName } from '../services/accountService';

vi.mock('../services/accountService');

const mockSearchAccountsByName = vi.mocked(searchAccountsByName);

describe('useAccountSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not search when the term is shorter than 2 characters', () => {
    const { result } = renderHook(() => useAccountSearch('a', null));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockSearchAccountsByName).not.toHaveBeenCalled();
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it('returns account suggestions after debounce', async () => {
    const accounts = [{ id: '001', name: 'Acme Corp' }];
    mockSearchAccountsByName.mockResolvedValue(accounts);

    const { result } = renderHook(() => useAccountSearch('ac', null));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(mockSearchAccountsByName).toHaveBeenCalledWith('ac');
    expect(result.current.suggestions).toEqual(accounts);
    expect(result.current.isSearching).toBe(false);
  });

  it('clears suggestions when the search service fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSearchAccountsByName.mockRejectedValue(new Error('Service unavailable'));

    const { result } = renderHook(() => useAccountSearch('ac', null));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isSearching).toBe(false);

    consoleError.mockRestore();
  });
});
