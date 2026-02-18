import RecordCard from './RecordCard';
import { DiscogsRelease } from '../types';

interface RecordListProps {
  records?: DiscogsRelease[];
}

export default function RecordList({ records = [] }: RecordListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}
