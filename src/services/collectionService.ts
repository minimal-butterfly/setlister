import { supabase } from '@/lib/supabase';
import { resolveCollectionQuery, SORT_COLUMN, type CollectionQuery } from '@/lib/collectionQuery';

export interface CollectionRecord {
  id: number;
  title: string;
  artist: string;
  year?: number | null;
  label?: string | null;
  cover_image?: string | null;
  created_at?: string;
}

export type NewRecord = Omit<CollectionRecord, 'created_at'>;

export async function saveRecord(record: NewRecord) {
  const { data, error } = await supabase
    .from('records')
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export interface CollectionPage {
  records: CollectionRecord[];
  total: number;
}

/**
 * One page of the collection. id is always the secondary order so offset batches
 * never skip or repeat rows, and unknown years (null) sort last in both directions.
 * Without a limit, the whole collection is returned and `from` is ignored.
 */
export async function getCollection(query?: CollectionQuery): Promise<CollectionPage> {
  const { sort, dir, from, limit } = resolveCollectionQuery(query);
  const ascending = dir === 'asc';

  let request = supabase
    .from('records')
    .select('*', { count: 'exact' })
    .order(SORT_COLUMN[sort], { ascending, nullsFirst: false })
    .order('id', { ascending });

  if (limit !== undefined) request = request.range(from, from + limit - 1);

  const { data, count, error } = await request;
  if (error) throw error;
  return { records: data, total: count ?? 0 };
}

export async function getRecord(id: number): Promise<CollectionRecord | null> {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Which of the given ids are in the collection. */
export async function getCollectedIds(ids: number[]): Promise<number[]> {
  const { data, error } = await supabase
    .from('records')
    .select('id')
    .in('id', ids);
  if (error) throw error;
  return data.map((row) => row.id);
}

export async function removeRecord(id: number) {
  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
