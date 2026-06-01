import { useState, useEffect } from 'react';
import { searchAccountsByName } from '../services/accountService';
import { AccountSummary } from '../types';

export function useAccountSearch(searchTerm: string, initialValue: AccountSummary | null) {
  const [suggestions, setSuggestions] = useState<AccountSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    // If search term matches the current selected account name, don't search
    if (initialValue && searchTerm === initialValue.name) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchAccountsByName(searchTerm);
        setSuggestions(results);
      } catch (error) {
        console.error('Account search failed:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, initialValue]);

  return { suggestions, isSearching };
}
