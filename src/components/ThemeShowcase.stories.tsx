import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SearchBar from './SearchBar';
import RecordCard from './RecordCard';
import { DiscogsRelease } from '../types';

const mockRecord: DiscogsRelease = {
  id: 1,
  title: 'Strings of Life',
  artist: 'Rhythim Is Rhythim',
  year: 1987,
  label: 'Transmat',
  resource_url: 'https://api.discogs.com/releases/1',
  tracklist: [],
};

const THEMES = ['techno', 'acid', 'trance'] as const;

function ThemeColumn({ theme }: { theme: string }) {
  return (
    <div
      data-theme={theme}
      style={{ background: 'var(--color-surface)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px' }}
    >
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--primitive-text-xs)',
        letterSpacing: 'var(--letter-spacing-heading)',
        textTransform: 'var(--text-transform-heading)' as React.CSSProperties['textTransform'],
        color: 'var(--color-accent)',
        margin: '0 0 8px',
      }}>
        {theme}
      </h3>
      <SearchBar onSearch={() => {}} isLoading={false} />
      <RecordCard record={mockRecord} />
    </div>
  );
}

function ThemeShowcaseDoc() {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {THEMES.map((theme) => <ThemeColumn key={theme} theme={theme} />)}
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Theme Showcase',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllThemes: Story = {
  render: () => <ThemeShowcaseDoc />,
  name: 'All Themes Side by Side',
};
