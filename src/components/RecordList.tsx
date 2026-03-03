import RecordCard from './RecordCard';
import { DiscogsRelease } from '../types';

interface RecordListProps {
  records?: DiscogsRelease[];
  collectionIds?: Set<number>;
  onAddToCollection?: (record: DiscogsRelease) => Promise<void>;
}

export default function RecordList({ records = [], collectionIds, onAddToCollection }: RecordListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          isInCollection={collectionIds?.has(record.id)}
          onAddToCollection={onAddToCollection}
        />
      ))}
    </div>
  );
}
