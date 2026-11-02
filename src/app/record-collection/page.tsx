'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { addToCollection, removeFromCollection } from '../../lib/collectionApi';
import { DiscogsRelease } from '../../types';
import { CollectionRecord } from '../../services/collectionService';
import styles from './RecordCollection.module.css';

export default function RecordCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const [releases, setReleases] = useState<DiscogsRelease[]>([]);
  const [loading, setLoading] = useState(!!initialQ);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialQ);

  const [collection, setCollection] = useState<CollectionRecord[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(true);

  const { toast, showToast } = useToast();

  const fetchCollection = useCallback(async () => {
    try {
      const res = await fetch('/api/collection');
      if (res.ok) {
        const data = await res.json();
        setCollection(data);
      }
    } finally {
      setCollectionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleAdd = useCallback(
    async (release: DiscogsRelease) => {
      const result = await addToCollection(release.id);

      if (result.status === 'added') {
        setCollection((prev) => [result.record, ...prev]);
        showToast(`${result.record.artist} — ${result.record.title} has been added to your collection!`);
      } else if (result.status === 'exists') {
        fetchCollection();
      } else {
        showToast(result.message);
      }
    },
    [showToast, fetchCollection]
  );

  const handleRemove = useCallback(
    async (id: number) => {
      if (await removeFromCollection(id)) {
        setCollection((prev) => prev.filter((r) => r.id !== id));
      } else {
        showToast('Could not remove this record');
      }
    },
    [showToast]
  );

  const collectionIds = new Set(collection.map((r) => r.id));

  const handleSearch = useCallback(
    (term: string) => {
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
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Record Collection</h1>

        <div className={styles.searchWrapper}>
          <SearchBar onSearch={handleSearch} isLoading={loading} initialValue={initialQ} />
        </div>

        {!searchTerm ? (
          <section>
            {collectionLoading ? (
              <p className={styles.emptyState}>Loading collection...</p>
            ) : collection.length === 0 ? (
              <p className={styles.emptyState}>
                Your collection is empty. Search Discogs to add records.
              </p>
            ) : (
              <>
                <h2 className={styles.collectionCount}>
                  {collection.length} record{collection.length !== 1 ? 's' : ''}
                </h2>
                <div className={styles.grid}>
                  {collection.map((record) => (
                    <div key={record.id} className={styles.card}>
                      <Link href={`/record/${record.id}`} className={styles.cardLink}>
                        {record.cover_image && (
                          <div className={styles.coverWrapper}>
                            <Image
                              src={record.cover_image}
                              alt={`${record.title} cover`}
                              width={200}
                              height={200}
                              className={styles.cover}
                            />
                          </div>
                        )}
                        <h3 className={styles.cardTitle}>{record.title}</h3>
                        <p className={styles.cardArtist}>{record.artist}</p>
                        <p className={styles.cardMeta}>{record.year} • {record.label}</p>
                      </Link>
                      <button
                        onClick={() => handleRemove(record.id)}
                        className={styles.removeButton}
                        title="Remove from collection"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        ) : (
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
