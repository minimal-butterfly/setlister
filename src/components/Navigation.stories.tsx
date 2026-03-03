import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import Navigation from './Navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  decorators: [
    (Story) => React.createElement(ThemeProvider, null, React.createElement(Story)),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {};
