import type { DiscogsRelease } from '@/types';
import type { NewRecord } from '@/services/collectionService';

// Discogs appends " (2)", " (3)" … to tell apart artists/labels that share a name.
const DISAMBIGUATION_SUFFIX = /\s\(\d+\)$/;
const MIN_YEAR = 1900;

function cleanName(name: string): string {
  return name.replace(DISAMBIGUATION_SUFFIX, '').trim();
}

function formatArtists(artists: DiscogsRelease['artists']): string {
  if (!artists || artists.length === 0) return 'Unknown Artist';

  return artists
    .map((artist, i) => {
      const name = cleanName(artist.name);
      if (i === artists.length - 1) return name;
      const join = artist.join?.trim();
      return !join || join === ',' ? `${name}, ` : `${name} ${join} `;
    })
    .join('');
}

// Discogs uses year 0 for "unknown", so anything outside a plausible range is dropped.
function validYear(year: unknown): number | undefined {
  const maxYear = new Date().getFullYear() + 1;
  return Number.isInteger(year) && (year as number) >= MIN_YEAR && (year as number) <= maxYear
    ? (year as number)
    : undefined;
}

function coverImage(release: DiscogsRelease): string | undefined {
  const url =
    release.images?.find((image) => image.type === 'primary')?.uri ??
    release.images?.[0]?.uri ??
    release.thumb;
  return url && url.startsWith('https://') ? url : undefined;
}

/**
 * Turns a full Discogs release (GET /releases/:id) into the record we store.
 * This is the only place that decides what a record's metadata looks like.
 */
export function toCollectionRecord(release: DiscogsRelease): NewRecord {
  const label = release.labels?.[0]?.name;

  return {
    id: release.id,
    title: release.title?.trim() || 'Untitled',
    artist: formatArtists(release.artists),
    year: validYear(release.year),
    label: label ? cleanName(label) : undefined,
    cover_image: coverImage(release),
  };
}
