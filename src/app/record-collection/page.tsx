'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
import { DiscogsRelease } from '../../types';

export default function RecordCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const [releases, setReleases] = useState<DiscogsRelease[]>([]);
  const [loading, setLoading] = useState(!!initialQ);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialQ);

  const handleSearch = useCallback((term: string) => {
    if (term) {
      setLoading(true);
      setError(null);
      setReleases([]);
      setSearchTerm(term);
      router.replace(`/record-collection?q=${encodeURIComponent(term)}`);
    } else {
      setReleases([]);
      setError(null);
      setLoading(false);
      setSearchTerm('');
      router.replace('/record-collection');
    }
  }, [router]);

  useEffect(() => {
    if (!searchTerm) return;

    const controller = new AbortController();

    const fetchReleases = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch releases');
        const data = await response.json();
        setReleases(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to fetch releases');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchReleases();

    return () => {
      controller.abort();
    };
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-start py-32 px-16 bg-white dark:bg-black">
        <header className="w-full text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Record Collection</h1>
        </header>

        <div className="w-full mb-8">
          <SearchBar
            onSearch={handleSearch}
            isLoading={loading}
            initialValue={initialQ}
          />
        </div>

        {!searchTerm ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            Your collection is empty. Search Discogs to add records.
          </p>
        ) : (
          <SearchResults
            results={releases}
            isLoading={loading}
            searchTerm={searchTerm}
            error={error}
          />
        )}
      </main>
    </div>
  );
}
