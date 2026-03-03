'use client';

import RecordList from './RecordList';
import { DiscogsRelease } from '../types';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  results: DiscogsRelease[];
  isLoading: boolean;
  searchTerm: string;
  error: string | null;
  collectionIds?: Set<number>;
  onAddToCollection?: (record: DiscogsRelease) => Promise<void>;
}

export default function SearchResults({ results, isLoading, searchTerm, error, collectionIds, onAddToCollection }: SearchResultsProps) {
  if (isLoading) {
    return <p className={styles.message}>Searching...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (results.length === 0) {
    return (
      <p className={styles.message}>
        No releases found for &apos;{searchTerm}&apos;
      </p>
    );
  }

  return <RecordList records={results} collectionIds={collectionIds} onAddToCollection={onAddToCollection} />;
}
