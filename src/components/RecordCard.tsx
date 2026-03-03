'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DiscogsRelease } from '../types';
import Image from 'next/image';

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

  return (
    <div className="relative border border-gray-200 rounded-lg dark:border-gray-700 hover:shadow-lg transition-shadow">
      <Link href={href} className="block p-4 cursor-pointer">
        {record.thumb && (
          <div className="mb-4">
            <Image
              src={record.thumb}
              alt={`${record.title} cover`}
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
          {record.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {record.artist}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
          {record.year} • {record.label}
        </p>
      </Link>
      {onAddToCollection && (
        <button
          onClick={handleAdd}
          disabled={isInCollection || adding}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            isInCollection
              ? 'bg-green-500 text-white cursor-default'
              : adding
              ? 'bg-zinc-400 text-white cursor-wait'
              : 'bg-cyber-orange text-white hover:opacity-80'
          }`}
          title={isInCollection ? 'In collection' : 'Add to collection'}
        >
          {isInCollection ? '✓' : adding ? '…' : '+'}
        </button>
      )}
    </div>
  );
}
