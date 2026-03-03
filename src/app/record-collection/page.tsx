'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
import { DiscogsRelease } from '../../types';
import { CollectionRecord } from '../../services/collectionService';

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
    const label =
      Array.isArray(record.labels) && record.labels.length > 0
        ? record.labels[0].name
        : typeof record.label === 'string'
        ? record.label
        : undefined;

    const res = await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: record.id,
        title: record.title,
        artist: record.artist,
        ...(record.year != null && { year: record.year }),
        ...(label ? { label } : {}),
        ...((record.cover_image || record.thumb) ? { cover_image: record.cover_image || record.thumb } : {}),
      }),
    });

    if (res.ok) {
      const saved = await res.json();
      setCollection((prev) => [saved, ...prev]);
    }
    // 409 = already in collection — state is already correct
  }, []);

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-start py-32 px-16 bg-white dark:bg-black">
        <header className="w-full text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Record Collection</h1>
        </header>

        <div className="w-full mb-8">
          <SearchBar onSearch={handleSearch} isLoading={loading} initialValue={initialQ} />
        </div>

        {!searchTerm ? (
          <section className="w-full">
            {collectionLoading ? (
              <p className="text-zinc-600 dark:text-zinc-400">Loading collection...</p>
            ) : collection.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                Your collection is empty. Search Discogs to add records.
              </p>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400 mb-4">
                  {collection.length} record{collection.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.map((record) => (
                    <div
                      key={record.id}
                      className="relative border border-gray-200 rounded-lg dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/record/${record.id}`} className="block p-4 cursor-pointer">
                        {record.cover_image && (
                          <div className="mb-4">
                            <Image
                              src={record.cover_image}
                              alt={`${record.title} cover`}
                              width={200}
                              height={200}
                              className="w-full h-48 object-cover rounded"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                          {record.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{record.artist}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                          {record.year} • {record.label}
                        </p>
                      </Link>
                      <button
                        onClick={() => removeFromCollection(record.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-red-500 hover:text-white transition-colors"
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
    </div>
  );
}
