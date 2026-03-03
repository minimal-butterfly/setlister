import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SearchResults from './SearchResults';
import { DiscogsRelease } from '../types';

const mockResults: DiscogsRelease[] = [
  {
    id: 1,
    title: 'Strings of Life',
    artist: 'Rhythim Is Rhythim',
    year: 1987,
    label: 'Transmat',
    resource_url: 'https://api.discogs.com/releases/1',
    tracklist: [],
  },
  {
    id: 2,
    title: 'Pacific State',
    artist: '808 State',
    year: 1989,
    label: 'ZTT',
    resource_url: 'https://api.discogs.com/releases/2',
    tracklist: [],
  },
  {
    id: 3,
    title: 'Can You Feel It',
    artist: 'Larry Heard',
    year: 1986,
    label: 'Trax Records',
    resource_url: 'https://api.discogs.com/releases/3',
    tracklist: [],
  },
];

const meta: Meta<typeof SearchResults> = {
  title: 'Components/SearchResults',
  component: SearchResults,
  parameters: {
    layout: 'padded',
  },
  args: {
    searchTerm: 'techno',
    isLoading: false,
    error: null,
  },
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

export const WithResults: Story = {
  args: {
    results: mockResults,
  },
};

export const Loading: Story = {
  args: {
    results: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    results: [],
    searchTerm: 'xyzzy',
  },
};

export const Error: Story = {
  args: {
    results: [],
    error: 'Failed to fetch results. Please try again.',
  },
};
