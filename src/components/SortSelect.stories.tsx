import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SortSelect from './SortSelect';
import type { SortField } from '../lib/collectionQuery';

const THEMES = ['techno', 'acid', 'trance'] as const;

function InteractiveSortSelect({ initial = 'added' }: { initial?: SortField }) {
  const [value, setValue] = useState<SortField>(initial);
  return <SortSelect value={value} onChange={setValue} />;
}

const meta: Meta<typeof SortSelect> = {
  title: 'Components/SortSelect',
  component: SortSelect,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SortSelect>;

export const Default: Story = {
  render: () => <InteractiveSortSelect />,
};

export const SortedByArtist: Story = {
  render: () => <InteractiveSortSelect initial="artist" />,
};

export const AllThemes: Story = {
  name: 'All Themes Side by Side',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
      {THEMES.map((theme) => (
        <div key={theme} data-theme={theme} style={{ background: 'var(--color-surface)', padding: '24px', minWidth: '280px' }}>
          <InteractiveSortSelect />
        </div>
      ))}
    </div>
  ),
};
