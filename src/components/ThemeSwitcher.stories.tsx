import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import ThemeSwitcher from './ThemeSwitcher';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  decorators: [
    (Story) => React.createElement(ThemeProvider, null, React.createElement(Story)),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {};
