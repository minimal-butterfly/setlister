'use client';

import { useId } from 'react';
import { SORT_FIELDS, SORT_LABELS, type SortField } from '../lib/collectionQuery';
import styles from './SortSelect.module.css';

interface SortSelectProps {
  value: SortField;
  onChange: (sort: SortField) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  const id = useId();

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        Sort by
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SortField)}
        className={styles.select}
      >
        {SORT_FIELDS.map((field) => (
          <option key={field} value={field}>
            {SORT_LABELS[field]}
          </option>
        ))}
      </select>
    </div>
  );
}
