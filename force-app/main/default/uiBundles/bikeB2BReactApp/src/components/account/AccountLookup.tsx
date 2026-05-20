import React, { useState, useEffect, useRef } from 'react';
import { searchAccountsByName, AccountSummary } from '@/services/accountService';

export type AccountLookupProps = {
  value: AccountSummary | null;
  onChange: (account: AccountSummary | null) => void;
  disabled?: boolean;
};

const AccountLookup: React.FC<AccountLookupProps> = ({ value, onChange, disabled }) => {
  const [searchTerm, setSearchTerm] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState<AccountSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search term if value changes from outside
  useEffect(() => {
    setSearchTerm(value?.name || '');
  }, [value]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm.length >= 2 && !value || (value && searchTerm !== value.name)) {
        setIsSearching(true);
        const results = await searchAccountsByName(searchTerm);
        setSuggestions(results);
        setIsSearching(false);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, value]);

  const handleSelect = (account: AccountSummary) => {
    onChange(account);
    setSearchTerm(account.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm py-2 pl-3 pr-10 disabled:bg-muted disabled:text-muted-foreground/60 transition-all outline-none"
          placeholder="Search account by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && suggestions.length > 0 && setShowDropdown(true)}
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {value ? (
            <button
              onClick={handleClear}
              disabled={disabled}
              className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1.5 w-full bg-card shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-border">
          {isSearching ? (
            <div className="px-4 py-2 text-muted-foreground italic text-sm">Searching...</div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-2 text-muted-foreground italic text-sm">No accounts found</div>
          ) : (
            suggestions.map((account) => (
              <button
                key={account.id}
                className="w-full text-left px-4 py-2 hover:bg-accent focus:bg-accent text-foreground focus:outline-none transition-colors cursor-pointer"
                onClick={() => handleSelect(account)}
              >
                <div className="font-semibold text-foreground text-sm">{account.name}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AccountLookup;
