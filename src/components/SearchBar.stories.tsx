import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  args: {
    onSearch: () => {},
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

export const WithInitialValue: Story = {
  args: {
    initialValue: 'Detroit Techno',
  },
};

export const Loading: Story = {
  args: {
    initialValue: 'Acid House',
    isLoading: true,
  },
};
