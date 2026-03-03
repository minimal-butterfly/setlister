import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RecordList from './RecordList';
import { DiscogsRelease } from '../types';

const makeRecord = (id: number, title: string, artist: string, year: number, label: string): DiscogsRelease => ({
  id,
  title,
  artist,
  year,
  label,
  resource_url: `https://api.discogs.com/releases/${id}`,
  tracklist: [],
});

const mockRecords: DiscogsRelease[] = [
  makeRecord(1, 'Strings of Life', 'Rhythim Is Rhythim', 1987, 'Transmat'),
  makeRecord(2, 'Pacific State', '808 State', 1989, 'ZTT'),
  makeRecord(3, 'Can You Feel It', 'Larry Heard', 1986, 'Trax Records'),
  makeRecord(4, 'Good Life', 'Inner City', 1988, 'Ten Records'),
  makeRecord(5, 'Nude Photo', 'Rhythim Is Rhythim', 1987, 'Transmat'),
  makeRecord(6, 'Promised Land', 'Joe Smooth', 1987, 'DJ International'),
];

const meta: Meta<typeof RecordList> = {
  title: 'Components/RecordList',
  component: RecordList,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof RecordList>;

export const Default: Story = {
  args: {
    records: mockRecords,
  },
};

export const WithCollectionState: Story = {
  args: {
    records: mockRecords,
    collectionIds: new Set([1, 3, 5]),
    onAddToCollection: async () => {},
  },
};

export const Empty: Story = {
  args: {
    records: [],
  },
};

export const SingleRecord: Story = {
  args: {
    records: mockRecords.slice(0, 1),
  },
};
