'use client';

import { useId } from 'react';
import {
  DEFAULT_DIRECTION,
  DIRECTION_LABELS,
  type SortDirection,
  type SortField,
} from '../lib/collectionQuery';
import styles from './SortDirectionToggle.module.css';

interface SortDirectionToggleProps {
  sort: SortField;
  value: SortDirection;
  onChange: (dir: SortDirection) => void;
}

// Two radio buttons styled as a segmented control: both options stay visible,
// and arrow keys switch between them like any native radio group.
export default function SortDirectionToggle({ sort, value, onChange }: SortDirectionToggleProps) {
  const name = useId();
  const defaultDir = DEFAULT_DIRECTION[sort];
  const options: SortDirection[] = [defaultDir, defaultDir === 'asc' ? 'desc' : 'asc'];

  return (
    <fieldset className={styles.group}>
      <legend className="sr-only">Sort order</legend>
      {options.map((dir) => (
        <label key={dir} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={dir}
            checked={value === dir}
            onChange={() => onChange(dir)}
            className={styles.input}
          />
          <span className={styles.text}>{DIRECTION_LABELS[sort][dir]}</span>
        </label>
      ))}
    </fieldset>
  );
}
