'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RecordCard from '../../../components/RecordCard';
import { DiscogsRelease } from '../../../types';

export default function RecordPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSearchTerm = searchParams.get('from');
  const [record, setRecord] = useState<DiscogsRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inCollection, setInCollection] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastFading, setToastFading] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
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
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const [releaseRes, collectionRes] = await Promise.all([
          fetch(`/api/releases/${params.id}`),
          fetch('/api/collection'),
        ]);

        if (!releaseRes.ok) throw new Error('Failed to fetch record details');
        const data = await releaseRes.json();
        setRecord(data);

        if (collectionRes.ok) {
          const collection = await collectionRes.json();
          setInCollection(collection.some((r: { id: number }) => r.id === Number(params.id)));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch record');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecord();
    }
  }, [params.id]);

  const handleAddToCollection = async () => {
    if (!record || inCollection || adding) return;
    setAdding(true);
    try {
      const label =
        Array.isArray(record.labels) && record.labels.length > 0
          ? record.labels[0].name
          : typeof record.label === 'string'
          ? record.label
          : undefined;

      const artist =
        Array.isArray(record.artists) && record.artists.length > 0
          ? record.artists.map((a) => a.name).join(', ')
          : typeof record.artist === 'string'
          ? record.artist
          : 'Unknown';

      const res = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: record.id,
          title: record.title,
          artist,
          ...(record.year != null && { year: record.year }),
          ...(label ? { label } : {}),
          ...((record.cover_image || record.thumb) ? { cover_image: record.cover_image || record.thumb } : {}),
        }),
      });

      if (res.ok) {
        setInCollection(true);
        showToast(`${artist} — ${record.title} has been added to your collection!`);
      } else if (res.status === 409) {
        setInCollection(true);
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading record details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Record not found</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {fromSearchTerm && (
          <Link
            href={`/record-collection?q=${encodeURIComponent(fromSearchTerm)}`}
            className="mb-6 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← Back to search results
          </Link>
        )}
        <div className="w-full flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Record Details</h1>
          <button
            onClick={handleAddToCollection}
            disabled={inCollection || adding}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              inCollection
                ? 'bg-green-500 text-white cursor-default'
                : adding
                ? 'bg-zinc-400 text-white cursor-wait'
                : 'bg-cyber-orange text-white hover:opacity-80'
            }`}
          >
            {inCollection ? '✓ In Collection' : adding ? 'Adding…' : '+ Add to Collection'}
          </button>
        </div>

        <div className="w-full max-w-2xl">
          <RecordCard record={record} />

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
                Additional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-zinc-50">Genres</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {record.genres?.join(', ') || 'N/A'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black dark:text-zinc-50">Styles</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {record.styles?.join(', ') || 'N/A'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black dark:text-zinc-50">Labels</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {Array.isArray(record.labels)
                      ? record.labels.map((label) => label.name).join(', ')
                      : record.label || 'N/A'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black dark:text-zinc-50">Release Year</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{record.year || 'N/A'}</p>
                </div>
              </div>
            </div>

            {record.tracklist && record.tracklist.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">Tracklist</h3>
                <div className="space-y-2">
                  {record.tracklist.map((track, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {track.position}. {track.title}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-500">{track.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {toastMessage && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 bg-zinc-900 text-white text-sm rounded-full shadow-lg whitespace-nowrap transition-opacity duration-500 ${
            toastFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
