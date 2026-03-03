import RecordCard from './RecordCard';
import { DiscogsRelease } from '../types';
import styles from './RecordList.module.css';

interface RecordListProps {
  records?: DiscogsRelease[];
  collectionIds?: Set<number>;
  onAddToCollection?: (record: DiscogsRelease) => Promise<void>;
}

export default function RecordList({ records = [], collectionIds, onAddToCollection }: RecordListProps) {
  return (
    <div className={styles.grid}>
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
