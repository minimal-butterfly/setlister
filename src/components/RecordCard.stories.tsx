import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RecordCard from './RecordCard';
import { DiscogsRelease } from '../types';

const baseRecord: DiscogsRelease = {
  id: 1,
  title: 'Strings of Life',
  artist: 'Rhythim Is Rhythim',
  year: 1987,
  label: 'Transmat',
  resource_url: 'https://api.discogs.com/releases/1',
  tracklist: [
    { position: 'A1', title: 'Strings of Life', duration: '10:32' },
    { position: 'B1', title: 'Strings of Life (Instrumental)', duration: '9:47' },
  ],
};

const meta: Meta<typeof RecordCard> = {
  title: 'Components/RecordCard',
  component: RecordCard,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RecordCard>;

export const Default: Story = {
  args: {
    record: baseRecord,
  },
};

export const WithAddButton: Story = {
  args: {
    record: baseRecord,
    isInCollection: false,
    onAddToCollection: async () => {},
  },
};

export const InCollection: Story = {
  args: {
    record: baseRecord,
    isInCollection: true,
    onAddToCollection: async () => {},
  },
};

export const LongTitle: Story = {
  args: {
    record: {
      ...baseRecord,
      title: 'An Extremely Long Record Title That Wraps Across Multiple Lines',
      artist: 'Various Artists feat. Someone Very Famous & Another Artist',
      label: 'A Very Long Label Name Records International',
    },
  },
};
