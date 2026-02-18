'use client';

import { useState, useEffect } from 'react';
import RecordList from '../../components/RecordList';
import { getReleaseDetails } from '../../services/discogsService';
import { DiscogsRelease } from '../../types';

export default function RecordCollection() {
  const [record, setRecord] = useState<DiscogsRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const releaseId = "93466-Underground-Resistance-Fuel-For-The-Fire-Attend-The-Riot";
        const recordData = await getReleaseDetails(releaseId);
        setRecord(recordData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <header className="w-full text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Record Collection</h1>
        </header>
        
        {loading && (
          <p className="text-zinc-600 dark:text-zinc-400">Loading record...</p>
        )}
        
        {error && (
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        )}
        
        {record && (
          <RecordList records={[record]} />
        )}
      </main>
    </div>
  );
}
