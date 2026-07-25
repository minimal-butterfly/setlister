const SETLISTS_KEY = 'setlists';

export interface Setlist {
  id: string;
  name: string;
  createdAt: string;
}

export interface SetlistEntry {
  id: string; // `${recordId}-${trackPosition}`
  setlistId: string;
  trackTitle: string;
  trackPosition: string;
  trackDuration: string;
  recordTitle: string;
  recordArtist: string;
  recordId: number;
}

function tracksKey(setlistId: string) {
  return `setlist-tracks-${setlistId}`;
}

export function getSetlists(): Setlist[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SETLISTS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function createSetlist(name: string): Setlist {
  const setlist: Setlist = {
    id: `sl-${Date.now()}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(SETLISTS_KEY, JSON.stringify([...getSetlists(), setlist]));
  return setlist;
}

export function getSetlistTracks(setlistId: string): SetlistEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(tracksKey(setlistId)) ?? '[]');
  } catch {
    return [];
  }
}

export function addTrackToSetlist(
  setlistId: string,
  track: Omit<SetlistEntry, 'id' | 'setlistId'>
): void {
  const entries = getSetlistTracks(setlistId);
  const id = `${track.recordId}-${track.trackPosition}`;
  if (entries.some((e) => e.id === id)) return;
  localStorage.setItem(
    tracksKey(setlistId),
    JSON.stringify([...entries, { ...track, id, setlistId }])
  );
}

export function isTrackInSetlist(
  setlistId: string,
  recordId: number,
  trackPosition: string
): boolean {
  if (typeof window === 'undefined') return false;
  return getSetlistTracks(setlistId).some(
    (e) => e.id === `${recordId}-${trackPosition}`
  );
}
