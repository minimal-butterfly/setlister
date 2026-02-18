import { DiscogsRelease } from '../types';
import Image from 'next/image';

interface RecordCardProps {
  record: DiscogsRelease;
}

export default function RecordCard({ record }: RecordCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
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
  );
}
