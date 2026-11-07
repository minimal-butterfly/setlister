'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  DEFAULT_DIRECTION,
  DEFAULT_SORT,
  isSortDirection,
  isSortField,
  type SortDirection,
  type SortField,
} from '@/lib/collectionQuery';

export interface CollectionParams {
  q: string;
  label: string;
  sort: SortField;
  dir: SortDirection;
}

interface ReadableParams {
  get(name: string): string | null;
}

/**
 * Reads collection state from the URL. URLs are hand-editable, so anything invalid
 * falls back to its default instead of erroring: an unknown sort becomes the
 * default sort, an unknown dir becomes that sort's default direction.
 */
export function parseCollectionParams(params: ReadableParams): CollectionParams {
  const sortParam = params.get('sort');
  const dirParam = params.get('dir');
  const sort = isSortField(sortParam) ? sortParam : DEFAULT_SORT;
  const dir = isSortDirection(dirParam) ? dirParam : DEFAULT_DIRECTION[sort];

  return {
    q: params.get('q')?.trim() ?? '',
    label: params.get('label')?.trim() ?? '',
    sort,
    dir,
  };
}

/** Builds the query string, leaving out defaults so the plain collection URL stays clean. */
export function serializeCollectionParams({ q, label, sort, dir }: CollectionParams): string {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (label.trim()) params.set('label', label.trim());
  if (sort !== DEFAULT_SORT) params.set('sort', sort);
  if (dir !== DEFAULT_DIRECTION[sort]) params.set('dir', dir);
  return params.toString();
}

/**
 * Applies a change to the current params. Changing the sort field without
 * picking a direction resets the direction to that field's default.
 */
export function mergeCollectionParams(
  current: CollectionParams,
  patch: Partial<CollectionParams>
): CollectionParams {
  const next = { ...current, ...patch };
  if (patch.sort !== undefined && patch.dir === undefined) {
    next.dir = DEFAULT_DIRECTION[next.sort];
  }
  return next;
}

/**
 * q, label, sort and dir for the collection, kept in the URL.
 * Updates replace the history entry unless `push` is set, so typing doesn't flood Back.
 * Scrolling is left to the list.
 */
export function useCollectionParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => parseCollectionParams(searchParams), [searchParams]);

  const setParams = useCallback(
    (patch: Partial<CollectionParams>, { push = false }: { push?: boolean } = {}) => {
      const query = serializeCollectionParams(mergeCollectionParams(params, patch));
      const url = query ? `${pathname}?${query}` : pathname;
      if (push) {
        router.push(url, { scroll: false });
      } else {
        router.replace(url, { scroll: false });
      }
    },
    [params, pathname, router]
  );

  return { params, setParams };
}
