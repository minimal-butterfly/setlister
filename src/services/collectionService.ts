import { supabase } from '@/lib/supabase';

export interface CollectionRecord {
  id: number;
  title: string;
  artist: string;
  year?: number | null;
  label?: string | null;
  cover_image?: string | null;
  created_at?: string;
}

type NewRecord = Omit<CollectionRecord, 'created_at'>;

export async function saveRecord(record: NewRecord) {
  const { data, error } = await supabase
    .from('records')
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getCollection() {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function removeRecord(id: number) {
  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
