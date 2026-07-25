'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import RecordCard from './RecordCard';
import { CollectionRecord } from '../services/collectionService';
import styles from './Main.module.css';

export default function Main() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collection')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CollectionRecord[]) => setRecords(data.slice(0, 10)))
      .finally(() => setLoading(false));
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/record-collection?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search records..."
            className={styles.searchInput}
            aria-label="Search records"
          />
        </div>

        <section className={styles.recentSection}>
          <h2 className={styles.sectionTitle}>Latest in Collection</h2>
          {loading ? (
            <p className={styles.emptyState}>Loading...</p>
          ) : records.length === 0 ? (
            <p className={styles.emptyState}>No records in collection yet.</p>
          ) : (
            <div className={styles.grid}>
              {records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={{
                    id: record.id,
                    title: record.title,
                    artist: record.artist,
                    year: record.year ?? 0,
                    label: record.label ?? '',
                    resource_url: '',
                    tracklist: [],
                    thumb: record.cover_image ?? undefined,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
