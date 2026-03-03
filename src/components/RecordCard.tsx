'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DiscogsRelease } from '../types';
import Image from 'next/image';
import styles from './RecordCard.module.css';

interface RecordCardProps {
  record: DiscogsRelease;
  searchTerm?: string;
  isInCollection?: boolean;
  onAddToCollection?: (record: DiscogsRelease) => Promise<void>;
}

export default function RecordCard({ record, searchTerm, isInCollection, onAddToCollection }: RecordCardProps) {
  const searchParams = useSearchParams();
  const effectiveTerm = searchTerm ?? searchParams.get('q') ?? '';
  const [adding, setAdding] = useState(false);

  const href = effectiveTerm
    ? `/record/${record.id}?from=${encodeURIComponent(effectiveTerm)}`
    : `/record/${record.id}`;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onAddToCollection || isInCollection || adding) return;
    setAdding(true);
    try {
      await onAddToCollection(record);
    } finally {
      setAdding(false);
    }
  };

  const buttonClass = [
    styles.addButton,
    isInCollection ? styles.addButtonAdded : '',
    adding ? styles.addButtonAdding : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.card}>
      <Link href={href} className={styles.link}>
        {record.thumb && (
          <div className={styles.imageWrapper}>
            <Image
              src={record.thumb}
              alt={`${record.title} cover`}
              width={200}
              height={200}
              className={styles.image}
            />
          </div>
        )}
        <h3 className={styles.title}>{record.title}</h3>
        <p className={styles.artist}>{record.artist}</p>
        <p className={styles.meta}>{record.year} • {record.label}</p>
      </Link>
      {onAddToCollection && (
        <button
          onClick={handleAdd}
          disabled={isInCollection || adding}
          className={buttonClass}
          title={isInCollection ? 'In collection' : 'Add to collection'}
        >
          {isInCollection ? '✓' : adding ? '…' : '+'}
        </button>
      )}
    </div>
  );
}
