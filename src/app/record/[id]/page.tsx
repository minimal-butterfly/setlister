'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RecordCard from '../../../components/RecordCard';
import TrackSetlistMenu from '../../../components/TrackSetlistMenu';
import Toast from '../../../components/Toast';
import { useToast } from '../../../hooks/useToast';
import { addToCollection, removeFromCollection } from '../../../lib/collectionApi';
import { DiscogsRelease } from '../../../types';
import styles from './RecordDetail.module.css';

export default function RecordPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSearchTerm = searchParams.get('from');
  const [record, setRecord] = useState<DiscogsRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inCollection, setInCollection] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const [releaseRes, collectionRes] = await Promise.all([
          fetch(`/api/releases/${params.id}`),
          fetch(`/api/collection/${params.id}`),
        ]);

        if (!releaseRes.ok) throw new Error('Failed to fetch record details');
        const data = await releaseRes.json();
        setRecord(data);

        setInCollection(collectionRes.ok);
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
    const result = await addToCollection(record.id);
    setAdding(false);

    if (result.status === 'added') {
      setInCollection(true);
      showToast(`${result.record.artist} — ${result.record.title} has been added to your collection!`);
    } else if (result.status === 'exists') {
      setInCollection(true);
    } else {
      showToast(result.message);
    }
  };

  const handleDeleteFromCollection = async () => {
    if (!record || deleting) return;
    setDeleting(true);
    setIsHoveringDelete(false);
    const removed = await removeFromCollection(record.id);
    setDeleting(false);

    if (removed) {
      setInCollection(false);
      setDeleted(true);
    } else {
      showToast('Could not remove this record');
    }
  };

  const handlePutBack = async () => {
    if (!record) return;
    const result = await addToCollection(record.id);

    if (result.status === 'error') {
      showToast(result.message);
      return;
    }
    setDeleted(false);
    setInCollection(true);
  };

  if (loading) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateMessage}>Loading record details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateError}>Error: {error}</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateMessage}>Record not found</p>
      </div>
    );
  }

  const addButtonClass = [
    styles.addButton,
    inCollection && !isHoveringDelete ? styles.addButtonAdded : '',
    inCollection && isHoveringDelete ? styles.addButtonDelete : '',
    adding || deleting ? styles.addButtonAdding : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {fromSearchTerm && (
          <Link
            href={`/search?q=${encodeURIComponent(fromSearchTerm)}`}
            className={styles.backLink}
          >
            ← Back to search results
          </Link>
        )}

        <div className={styles.header}>
          <h1 className={styles.title}>Record Details</h1>
          {deleted ? (
            <div className={styles.deletedState}>
              <span className={styles.deletedLabel}>Deleted</span>
              <button onClick={handlePutBack} className={styles.putBackButton}>
                Put back
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-4.86" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={inCollection ? handleDeleteFromCollection : handleAddToCollection}
              disabled={adding || deleting}
              onMouseEnter={() => inCollection && setIsHoveringDelete(true)}
              onMouseLeave={() => setIsHoveringDelete(false)}
              className={addButtonClass}
            >
              {deleting ? 'Deleting…'
                : inCollection && isHoveringDelete ? '✕ Delete from Collection'
                : inCollection ? '✓ In Collection'
                : adding ? 'Adding…'
                : '+ Add to Collection'}
            </button>
          )}
        </div>

        <RecordCard record={record} />

        <div className={styles.details}>
          <h2 className={styles.sectionTitle}>Additional Information</h2>

          <div className={styles.infoGrid}>
            <div>
              <h3 className={styles.infoLabel}>Genres</h3>
              <p className={styles.infoValue}>{record.genres?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <h3 className={styles.infoLabel}>Styles</h3>
              <p className={styles.infoValue}>{record.styles?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <h3 className={styles.infoLabel}>Labels</h3>
              <p className={styles.infoValue}>
                {Array.isArray(record.labels)
                  ? record.labels.map((label) => label.name).join(', ')
                  : record.label || 'N/A'}
              </p>
            </div>
            <div>
              <h3 className={styles.infoLabel}>Release Year</h3>
              <p className={styles.infoValue}>{record.year || 'N/A'}</p>
            </div>
          </div>

          {record.tracklist && record.tracklist.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Tracklist</h2>
              <div className={styles.tracklist}>
                {record.tracklist.map((track, index) => (
                  <div key={index} className={styles.trackRow}>
                    <span className={styles.trackInfo}>
                      <span className={styles.trackPosition}>{track.position}</span>
                      <span>{track.title}</span>
                    </span>
                    <span className={styles.trackMeta}>
                      <span>{track.duration}</span>
                      <TrackSetlistMenu track={track} record={record} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Toast toast={toast} />
    </div>
  );
}
