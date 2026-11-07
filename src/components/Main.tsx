'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import LatestRecords from './LatestRecords';
import styles from './Main.module.css';

export default function Main() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search records..."
            className={styles.searchInput}
            aria-label="Search records"
          />
        </div>

        <LatestRecords />
      </main>

      <Footer />
    </div>
  );
}
