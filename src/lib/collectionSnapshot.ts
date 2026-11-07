import type { CollectionRecord } from '@/services/collectionService';

// What the collection list needs to come back exactly as it was after
// Collection → Record Detail → Back: the loaded batches, the scroll position
// and the card that was opened. Lives in sessionStorage, so it is per tab.

const STORAGE_KEY = 'setlister:collection-snapshot';

export interface CollectionSnapshot {
  /** The serialized URL params the list was loaded for. A snapshot only restores onto the same params. */
  key: string;
  records: CollectionRecord[];
  total: number;
  autoLoadFrom: number;
  scrollY: number;
  focusId: number;
}

export function saveCollectionSnapshot(snapshot: CollectionSnapshot): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage full or blocked: Back just shows a fresh list.
  }
}

export function readCollectionSnapshot(key: string): CollectionSnapshot | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const snapshot: CollectionSnapshot = JSON.parse(raw);
    return snapshot.key === key && Array.isArray(snapshot.records) ? snapshot : null;
  } catch {
    return null;
  }
}

/** Call whenever the collection changes, so a stale list is never restored. */
export function clearCollectionSnapshot(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
