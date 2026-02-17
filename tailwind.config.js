/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#000000',
        'cyber-orange': '#FF5E1A',
        'cyber-violet': '#8F00FF',
        'cyber-border': '#333333',
        'cyber-text': '#FFFFFF',
        'cyber-text-secondary': 'rgba(255, 255, 255, 0.9)',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },
      borderRadius: {
        'none': '0',
      },
      borderWidth: {
        '1': '1px',
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
      },
    },
  },
  plugins: [],
}
