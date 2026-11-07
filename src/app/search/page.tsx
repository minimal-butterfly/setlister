'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { addToCollection } from '../../lib/collectionApi';
import { DiscogsRelease } from '../../types';
import styles from './Search.module.css';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const [releases, setReleases] = useState<DiscogsRelease[]>([]);
  const [loading, setLoading] = useState(!!initialQ);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [collectionIds, setCollectionIds] = useState<Set<number>>(new Set());

  const { toast, showToast } = useToast();

  const handleAdd = useCallback(
    async (release: DiscogsRelease) => {
      const result = await addToCollection(release.id);

      if (result.status === 'added' || result.status === 'exists') {
        setCollectionIds((prev) => new Set(prev).add(release.id));
        if (result.status === 'added') {
          showToast(`${result.record.artist} — ${result.record.title} has been added to your collection!`);
        }
      } else {
        showToast(result.message);
      }
    },
    [showToast]
  );

  const handleSearch = useCallback(
    (term: string) => {
      if (term) {
        setLoading(true);
        setError(null);
        setReleases([]);
        setSearchTerm(term);
        router.replace(`/search?q=${encodeURIComponent(term)}`);
      } else {
        setReleases([]);
        setError(null);
        setLoading(false);
        setSearchTerm('');
        router.replace('/search');
      }
    },
    [router]
  );

  useEffect(() => {
    if (!searchTerm) return;

    const controller = new AbortController();

    const fetchReleases = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to fetch releases');
        const data: DiscogsRelease[] = await response.json();
        setReleases(data);

        // Badges only; if this check fails the results still show, just without "in collection".
        if (data.length > 0) {
          const idsRes = await fetch(
            `/api/collection/contains?ids=${data.map((r) => r.id).join(',')}`,
            { signal: controller.signal }
          );
          if (idsRes.ok) {
            const { ids }: { ids: number[] } = await idsRes.json();
            setCollectionIds(new Set(ids));
          }
        }
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
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Search Discogs</h1>

        <div className={styles.searchWrapper}>
          <SearchBar onSearch={handleSearch} isLoading={loading} initialValue={initialQ} />
        </div>

        {searchTerm && (
          <SearchResults
            results={releases}
            isLoading={loading}
            searchTerm={searchTerm}
            error={error}
            collectionIds={collectionIds}
            onAddToCollection={handleAdd}
          />
        )}
      </main>

      <Toast toast={toast} />
    </div>
  );
}
