'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import styles from './SearchBar.module.css';

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
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search Discogs releases..."
          className={styles.input}
        />
        {inputValue && (
          <button
            onClick={() => setInputValue('')}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {isLoading && (
        <span className={styles.loading}>Searching...</span>
      )}
    </div>
  );
}
