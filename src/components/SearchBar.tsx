'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export default function SearchBar({ onSearch, isLoading, initialValue = '' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedValue = useDebounce(inputValue, 400);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (debouncedValue.length >= 2) {
      onSearch(debouncedValue);
    } else if (debouncedValue.length === 0) {
      onSearch('');
    }
  }, [debouncedValue, onSearch]);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search Discogs releases..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-black dark:border-gray-600 dark:bg-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyber-violet"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {isLoading && (
        <span className="text-xs text-zinc-400 whitespace-nowrap">Searching...</span>
      )}
    </div>
  );
}
