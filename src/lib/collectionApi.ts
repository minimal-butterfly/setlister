import type { CollectionRecord } from '@/services/collectionService';

export type AddResult =
  | { status: 'added'; record: CollectionRecord }
  | { status: 'exists' }
  | { status: 'error'; message: string };

/** Client-side call for adding a Discogs release to the collection. Never throws. */
export async function addToCollection(releaseId: number): Promise<AddResult> {
  try {
    const res = await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: releaseId }),
    });

    if (res.status === 409) return { status: 'exists' };
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { status: 'error', message: body?.error ?? 'Could not add this record' };
    }
    return { status: 'added', record: await res.json() };
  } catch {
    return { status: 'error', message: 'Network error: could not add this record' };
  }
}

/** Returns true if the record is gone from the collection. Never throws. */
export async function removeFromCollection(releaseId: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/collection/${releaseId}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
