'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { removeFromCollection } from '../../lib/collectionApi';
import { CollectionRecord } from '../../services/collectionService';
import { MAX_LIMIT } from '../../lib/collectionQuery';
import styles from './RecordCollection.module.css';

export default function RecordCollection() {
  const [collection, setCollection] = useState<CollectionRecord[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(true);

  const { toast, showToast } = useToast();

  const fetchCollection = useCallback(async () => {
    try {
      // Loads every page so the grid stays complete until lazy loading lands.
      const all: CollectionRecord[] = [];
      let total = Infinity;
      while (all.length < total) {
        const res = await fetch(`/api/collection?limit=${MAX_LIMIT}&from=${all.length}`);
        if (!res.ok) return;
        const page: { records: CollectionRecord[]; total: number } = await res.json();
        if (page.records.length === 0) break;
        all.push(...page.records);
        total = page.total;
      }
      setCollection(all);
    } finally {
      setCollectionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Record Collection</h1>

        <section>
          {collectionLoading ? (
            <p className={styles.emptyState}>Loading collection...</p>
          ) : collection.length === 0 ? (
            <p className={styles.emptyState}>
              Your collection is empty. <Link href="/search">Search Discogs</Link> to add records.
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
      </main>

      <Toast toast={toast} />
    </div>
  );
}
