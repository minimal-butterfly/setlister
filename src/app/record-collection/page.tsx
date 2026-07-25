'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
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

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastFading, setToastFading] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    setToastMessage(message);
    setToastFading(false);
    toastTimer.current = setTimeout(() => {
      setToastFading(true);
      fadeTimer.current = setTimeout(() => {
        setToastMessage(null);
        setToastFading(false);
      }, 500);
    }, 2500);
  }, []);

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

  const addToCollection = useCallback(async (record: DiscogsRelease) => {
    const artist =
      typeof record.artist === 'string' && record.artist.trim()
        ? record.artist
        : Array.isArray(record.artists) && record.artists.length > 0
        ? record.artists.map((a) => a.name).join(', ')
        : typeof record.title === 'string' && record.title.includes(' - ')
        ? record.title.split(' - ')[0].trim()
        : 'Unknown';

    const labelRaw = record.label as unknown;
    const label =
      Array.isArray(record.labels) && record.labels.length > 0
        ? record.labels[0].name
        : typeof labelRaw === 'string' && labelRaw
        ? labelRaw
        : Array.isArray(labelRaw) && labelRaw.length > 0
        ? String((labelRaw as string[])[0])
        : undefined;

    const yearNum = record.year != null ? parseInt(String(record.year), 10) : NaN;
    const year = Number.isInteger(yearNum) && yearNum >= 1900 ? yearNum : undefined;

    const res = await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: record.id,
        title: record.title,
        artist,
        ...(year !== undefined && { year }),
        ...(label ? { label } : {}),
        ...((record.cover_image || record.thumb) ? { cover_image: record.cover_image || record.thumb } : {}),
      }),
    });

    if (!res.ok && res.status !== 409) {
      const body = await res.json().catch(() => null);
      console.error('addToCollection failed', res.status, body);
      return;
    }

    if (res.ok) {
      const saved = await res.json();
      setCollection((prev) => [saved, ...prev]);
      const albumTitle =
        record.title.toLowerCase().startsWith((artist + ' - ').toLowerCase())
          ? record.title.slice(artist.length + 3)
          : record.title;
      showToast(`${artist} — ${albumTitle} has been added to your collection!`);
    }
  }, [showToast]);

  const removeFromCollection = useCallback(async (id: number) => {
    const res = await fetch(`/api/collection/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
      setCollection((prev) => prev.filter((r) => r.id !== id));
    }
  }, []);

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
                        onClick={() => removeFromCollection(record.id)}
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
            onAddToCollection={addToCollection}
          />
        )}
      </main>

      {toastMessage && (
        <div className={`${styles.toast} ${toastFading ? styles.toastFading : styles.toastVisible}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
