import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SortDirectionToggle from './SortDirectionToggle';
import { DEFAULT_DIRECTION, type SortDirection, type SortField } from '../lib/collectionQuery';

const THEMES = ['techno', 'acid', 'trance'] as const;

function InteractiveToggle({ sort }: { sort: SortField }) {
  const [value, setValue] = useState<SortDirection>(DEFAULT_DIRECTION[sort]);
  return <SortDirectionToggle sort={sort} value={value} onChange={setValue} />;
}

const meta: Meta<typeof SortDirectionToggle> = {
  title: 'Components/SortDirectionToggle',
  component: SortDirectionToggle,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SortDirectionToggle>;

export const Artist: Story = {
  render: () => <InteractiveToggle sort="artist" />,
};

export const DateAdded: Story = {
  render: () => <InteractiveToggle sort="added" />,
};

export const ReleaseYear: Story = {
  render: () => <InteractiveToggle sort="year" />,
};

export const AllThemes: Story = {
  name: 'All Themes Side by Side',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
      {THEMES.map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{ background: 'var(--color-surface)', padding: '24px', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <InteractiveToggle sort="artist" />
          <InteractiveToggle sort="added" />
        </div>
      ))}
    </div>
  ),
};
