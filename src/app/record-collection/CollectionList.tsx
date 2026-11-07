'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { removeFromCollection } from '../../lib/collectionApi';
import { DEFAULT_LIMIT, type SortDirection, type SortField } from '../../lib/collectionQuery';
import {
  clearCollectionSnapshot,
  readCollectionSnapshot,
  saveCollectionSnapshot,
} from '../../lib/collectionSnapshot';
import type { CollectionPage, CollectionRecord } from '../../services/collectionService';
import styles from './RecordCollection.module.css';

// Batches load by themselves until this many records have come in since the
// last "Load more" click (or the first load); then the button takes over.
const AUTO_LOAD_RECORDS = 60;

interface CollectionListProps {
  sort: SortField;
  dir: SortDirection;
  /** Serialized URL params. The parent remounts this list whenever they change. */
  snapshotKey: string;
}

export default function CollectionList({ sort, dir, snapshotKey }: CollectionListProps) {
  const [snapshot] = useState(() => readCollectionSnapshot(snapshotKey));
  const [records, setRecords] = useState<CollectionRecord[]>(snapshot?.records ?? []);
  const [total, setTotal] = useState<number | null>(snapshot?.total ?? null);
  const [autoLoadFrom, setAutoLoadFrom] = useState(snapshot?.autoLoadFrom ?? 0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [announcement, setAnnouncement] = useState('');

  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const focusIndexAfterLoad = useRef<number | null>(null);

  const { toast, showToast } = useToast();

  const hasMore = total === null || records.length < total;
  const canAutoLoad = records.length - autoLoadFrom < AUTO_LOAD_RECORDS;

  const loadMore = useCallback(
    async (from: number) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setStatus('loading');
      try {
        const res = await fetch(
          `/api/collection?sort=${sort}&dir=${dir}&from=${from}&limit=${DEFAULT_LIMIT}`
        );
        if (!res.ok) throw new Error('Failed to load collection');
        const page: CollectionPage = await res.json();

        // Offsets can shift if the collection changes elsewhere; never show a record twice.
        setRecords((prev) => {
          const seen = new Set(prev.map((r) => r.id));
          return [...prev, ...page.records.filter((r) => !seen.has(r.id))];
        });
        setTotal(page.total);
        setStatus('idle');

        if (from > 0) {
          const shown = Math.min(from + page.records.length, page.total);
          setAnnouncement(
            shown >= page.total
              ? `Loaded ${page.records.length} more records. All ${page.total} records shown.`
              : `Loaded ${page.records.length} more records. ${shown} of ${page.total} shown.`
          );
        }
      } catch {
        setStatus('error');
      } finally {
        inFlight.current = false;
      }
    },
    [sort, dir]
  );

  // Back from Record Detail: put the scroll position and focus back where they were.
  // Otherwise this is a fresh list (first visit or changed params), which starts at the top.
  useEffect(() => {
    if (!snapshot) {
      window.scrollTo(0, 0);
      return;
    }
    clearCollectionSnapshot();
    requestAnimationFrame(() => {
      window.scrollTo(0, snapshot.scrollY);
      listRef.current
        ?.querySelector<HTMLElement>(`[data-record-id="${snapshot.focusId}"]`)
        ?.focus({ preventScroll: true });
    });
  }, [snapshot]);

  // The sentinel sits after the last card. It also triggers the very first load,
  // because an empty list puts it straight into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || status !== 'idle' || !hasMore || !canAutoLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore(records.length);
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [status, hasMore, canAutoLoad, loadMore, records.length]);

  // The "Load more" button disappears while auto-loading resumes, so focus moves
  // to the first new record instead of being dropped onto the page.
  useEffect(() => {
    const index = focusIndexAfterLoad.current;
    if (index === null || records.length <= index) return;
    focusIndexAfterLoad.current = null;
    listRef.current?.querySelectorAll<HTMLElement>('[data-record-id]')[index]?.focus();
  }, [records]);

  const handleLoadMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (document.activeElement === e.currentTarget) {
      focusIndexAfterLoad.current = records.length;
    }
    setAutoLoadFrom(records.length);
    loadMore(records.length);
  };

  const handleRemove = useCallback(
    async (id: number) => {
      if (await removeFromCollection(id)) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        setTotal((prev) => (prev === null ? prev : prev - 1));
      } else {
        showToast('Could not remove this record');
      }
    },
    [showToast]
  );

  const handleOpen = (id: number) => {
    if (total === null) return;
    saveCollectionSnapshot({
      key: snapshotKey,
      records,
      total,
      autoLoadFrom,
      scrollY: window.scrollY,
      focusId: id,
    });
  };

  return (
    <section>
      {total === null ? (
        status === 'error' ? null : <p className={styles.emptyState}>Loading collection...</p>
      ) : total === 0 ? (
        <p className={styles.emptyState}>
          Your collection is empty. <Link href="/search">Search Discogs</Link> to add records.
        </p>
      ) : (
        <h2 className={styles.collectionCount}>
          {total} record{total !== 1 ? 's' : ''}
        </h2>
      )}

      <div ref={listRef} className={styles.grid}>
        {records.map((record) => (
          <div key={record.id} className={styles.card}>
            <Link
              href={`/record/${record.id}`}
              className={styles.cardLink}
              data-record-id={record.id}
              onClick={() => handleOpen(record.id)}
            >
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

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <div className={styles.listFooter}>
        {status === 'loading' && records.length > 0 && (
          <p className={styles.listStatus}>Loading more records...</p>
        )}
        {status === 'error' && (
          <>
            <p className={styles.listStatus}>Could not load records.</p>
            <button type="button" className={styles.loadMoreButton} onClick={() => loadMore(records.length)}>
              Try again
            </button>
          </>
        )}
        {status === 'idle' && hasMore && !canAutoLoad && (
          <button type="button" className={styles.loadMoreButton} onClick={handleLoadMoreClick}>
            Load {Math.min(DEFAULT_LIMIT, (total ?? 0) - records.length)} more
          </button>
        )}
        {status === 'idle' && !hasMore && records.length > 0 && (
          <p className={styles.listStatus}>End of collection.</p>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <Toast toast={toast} />
    </section>
  );
}
