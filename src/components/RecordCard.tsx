'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DiscogsRelease } from '../types';
import Image from 'next/image';

interface RecordCardProps {
  record: DiscogsRelease;
  searchTerm?: string;
}

export default function RecordCard({ record, searchTerm }: RecordCardProps) {
  const searchParams = useSearchParams();
  const effectiveTerm = searchTerm ?? searchParams.get('q') ?? '';

  const href = effectiveTerm
    ? `/record/${record.id}?from=${encodeURIComponent(effectiveTerm)}`
    : `/record/${record.id}`;

  return (
    <Link href={href}>
      <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
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
      </div>
    </Link>
  );
}
