import { describe, it, expect } from 'vitest';
import { toCollectionRecord } from './normalizeRelease';
import type { DiscogsRelease } from '@/types';

const base: DiscogsRelease = {
  id: 123,
  title: 'Strings of Life',
  artist: '',
  artists: [{ name: 'Rhythim Is Rhythim', join: '' }],
  year: 1987,
  label: '',
  labels: [{ name: 'Transmat', catno: 'MS-11', entity_type: '1', entity_type_name: 'Label', id: 1, resource_url: '' }],
  resource_url: '',
  thumb: 'https://i.discogs.com/thumb.jpg',
  images: [
    { type: 'secondary', uri: 'https://i.discogs.com/back.jpg' },
    { type: 'primary', uri: 'https://i.discogs.com/front.jpg' },
  ],
  tracklist: [],
};

describe('toCollectionRecord', () => {
  it('maps a full Discogs release to a collection record', () => {
    expect(toCollectionRecord(base)).toEqual({
      id: 123,
      title: 'Strings of Life',
      artist: 'Rhythim Is Rhythim',
      year: 1987,
      label: 'Transmat',
      cover_image: 'https://i.discogs.com/front.jpg',
    });
  });

  it('drops year 0, which Discogs uses for "unknown"', () => {
    expect(toCollectionRecord({ ...base, year: 0 }).year).toBeUndefined();
  });

  it('joins multiple artists using the Discogs join words', () => {
    const release = {
      ...base,
      artists: [
        { name: 'Surgeon', join: '&' },
        { name: 'Lady Starlight', join: ',' },
        { name: 'Regis', join: '' },
      ],
    };
    expect(toCollectionRecord(release).artist).toBe('Surgeon & Lady Starlight, Regis');
  });

  it('strips Discogs disambiguation suffixes like " (2)"', () => {
    const release = {
      ...base,
      artists: [{ name: 'Phase (2)', join: '' }],
      labels: [{ ...base.labels![0], name: 'Token (3)' }],
    };
    const record = toCollectionRecord(release);
    expect(record.artist).toBe('Phase');
    expect(record.label).toBe('Token');
  });

  it('falls back to the thumbnail, then to no cover', () => {
    expect(toCollectionRecord({ ...base, images: undefined }).cover_image).toBe(
      'https://i.discogs.com/thumb.jpg'
    );
    expect(toCollectionRecord({ ...base, images: undefined, thumb: '' }).cover_image).toBeUndefined();
  });

  it('never produces an empty artist or title', () => {
    const record = toCollectionRecord({ ...base, title: '  ', artists: [] });
    expect(record.title).toBe('Untitled');
    expect(record.artist).toBe('Unknown Artist');
  });
});
