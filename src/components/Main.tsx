'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from './Navigation';
import Footer from './Footer';
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
      <Navigation />

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
                <Link key={record.id} href={`/record/${record.id}`} className={styles.card}>
                  {record.cover_image ? (
                    <div className={styles.coverWrapper}>
                      <Image
                        src={record.cover_image}
                        alt={`${record.title} cover`}
                        width={200}
                        height={200}
                        className={styles.cover}
                      />
                    </div>
                  ) : (
                    <div className={styles.coverPlaceholder} />
                  )}
                  <p className={styles.cardTitle}>{record.title}</p>
                  <p className={styles.cardArtist}>{record.artist}</p>
                  {record.year && <p className={styles.cardMeta}>{record.year}</p>}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
