// Sort and paging rules for the collection. No Supabase import, so the API route
// and client code can share the whitelist and defaults.

export const SORT_FIELDS = ['artist', 'added', 'year'] as const;
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

export type SortField = (typeof SORT_FIELDS)[number];
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export const DEFAULT_SORT: SortField = 'added';
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

// artist reads A → Z by default; added and year show the newest first.
export const DEFAULT_DIRECTION: Record<SortField, SortDirection> = {
  artist: 'asc',
  added: 'desc',
  year: 'desc',
};

export const SORT_LABELS: Record<SortField, string> = {
  artist: 'Artist',
  added: 'Date added',
  year: 'Release year',
};

// Plain-language direction names, which depend on what is being sorted.
export const DIRECTION_LABELS: Record<SortField, Record<SortDirection, string>> = {
  artist: { asc: 'A → Z', desc: 'Z → A' },
  added: { asc: 'Oldest first', desc: 'Newest first' },
  year: { asc: 'Oldest first', desc: 'Newest first' },
};

// The database column behind each sort field.
export const SORT_COLUMN: Record<SortField, string> = {
  artist: 'sort_artist',
  added: 'created_at',
  year: 'year',
};

export interface CollectionQuery {
  sort?: SortField;
  dir?: SortDirection;
  from?: number;
  limit?: number;
}

export interface ResolvedCollectionQuery {
  sort: SortField;
  dir: SortDirection;
  from: number;
  limit?: number;
}

export class InvalidCollectionQueryError extends Error {
  name = 'InvalidCollectionQueryError';
}

export function isSortField(value: unknown): value is SortField {
  return SORT_FIELDS.includes(value as SortField);
}

export function isSortDirection(value: unknown): value is SortDirection {
  return SORT_DIRECTIONS.includes(value as SortDirection);
}

/** Fills in defaults and rejects anything outside the whitelist. Throws InvalidCollectionQueryError. */
export function resolveCollectionQuery(query: CollectionQuery = {}): ResolvedCollectionQuery {
  const { sort = DEFAULT_SORT, dir, from = 0, limit } = query;

  if (!isSortField(sort)) throw new InvalidCollectionQueryError(`Unknown sort field: ${String(sort)}`);
  if (dir !== undefined && !isSortDirection(dir)) {
    throw new InvalidCollectionQueryError(`Unknown sort direction: ${String(dir)}`);
  }
  if (!Number.isSafeInteger(from) || from < 0) {
    throw new InvalidCollectionQueryError('from must be a non-negative integer');
  }
  if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_LIMIT)) {
    throw new InvalidCollectionQueryError(`limit must be an integer from 1 to ${MAX_LIMIT}`);
  }

  return { sort, dir: dir ?? DEFAULT_DIRECTION[sort], from, limit };
}
