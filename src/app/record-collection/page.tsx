'use client';

import { Suspense } from 'react';
import CollectionList from './CollectionList';
import { serializeCollectionParams, useCollectionParams } from '../../hooks/useCollectionParams';
import styles from './RecordCollection.module.css';

// useSearchParams needs a Suspense boundary, or the build fails to prerender this page.
export default function RecordCollection() {
  return (
    <Suspense>
      <RecordCollectionPage />
    </Suspense>
  );
}

function RecordCollectionPage() {
  const { params } = useCollectionParams();
  const listKey = serializeCollectionParams(params);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Record Collection</h1>

        {/* A new key remounts the list: any param change starts again from the first batch. */}
        <CollectionList key={listKey} sort={params.sort} dir={params.dir} snapshotKey={listKey} />
      </main>
    </div>
  );
}
