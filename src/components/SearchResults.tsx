'use client';

import RecordList from './RecordList';
import { DiscogsRelease } from '../types';

interface SearchResultsProps {
  results: DiscogsRelease[];
  isLoading: boolean;
  searchTerm: string;
  error: string | null;
}

export default function SearchResults({ results, isLoading, searchTerm, error }: SearchResultsProps) {
  if (isLoading) {
    return <p className="text-zinc-600 dark:text-zinc-400">Searching...</p>;
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  if (results.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        No releases found for &apos;{searchTerm}&apos;
      </p>
    );
  }

  return <RecordList records={results} />;
}
