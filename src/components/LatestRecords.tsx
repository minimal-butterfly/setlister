'use client';

import { useState, useEffect } from 'react';
import RecordCard from './RecordCard';
import { CollectionRecord } from '../services/collectionService';
import styles from './LatestRecords.module.css';

export default function LatestRecords() {
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collection?limit=10')
      .then((r) => (r.ok ? r.json() : { records: [] }))
      .then((data: { records: CollectionRecord[] }) => setRecords(data.records))
      .finally(() => setLoading(false));
  }, []);

  return (
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
  );
}
