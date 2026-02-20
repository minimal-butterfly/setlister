'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`/api/releases/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch record details');
        }
        const data = await response.json();
        setRecord(data);
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
        <header className="w-full text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Record Details</h1>
        </header>
        
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
                      ? record.labels.map(label => label.name).join(', ')
                      : record.label || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-zinc-50">Release Year</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {record.year || 'N/A'}
                  </p>
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
                      <span className="text-zinc-500 dark:text-zinc-500">
                        {track.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
