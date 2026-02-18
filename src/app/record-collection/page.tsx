'use client';

import { useState, useEffect } from 'react';
import RecordList from '../../components/RecordList';
import { DiscogsRelease } from '../../types';

export default function RecordCollection() {
  const [releases, setReleases] = useState<DiscogsRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('/api/search?q=Underground%20Resistance');
        if (!response.ok) {
          throw new Error('Failed to fetch releases');
        }
        const data = await response.json();
        setReleases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch releases');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <header className="w-full text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Record Collection</h1>
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">Underground Resistance Releases</h2>
        </header>
        
        {loading && (
          <p className="text-zinc-600 dark:text-zinc-400">Loading releases...</p>
        )}
        
        {error && (
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        )}
        
        {releases.length > 0 && (
          <RecordList records={releases} />
        )}
      </main>
    </div>
  );
}
