import type { Preview, Decorator } from '@storybook/nextjs-vite';
import React from 'react';
import './storybook-fonts.css';
import '../src/styles/tokens/primitives.css';
import '../src/styles/tokens/semantic.css';
import '../src/styles/themes/techno.css';
import '../src/styles/themes/acid.css';
import '../src/styles/themes/trance.css';

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] as string) || 'techno';
  return React.createElement(
    'div',
    {
      'data-theme': theme,
      style: {
        background: 'var(--color-surface)',
        minHeight: '100vh',
        padding: '24px',
      },
    },
    React.createElement(Story),
  );
};

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'techno',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'techno', title: 'Techno' },
          { value: 'acid',   title: 'Acid' },
          { value: 'trance', title: 'Trance' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
