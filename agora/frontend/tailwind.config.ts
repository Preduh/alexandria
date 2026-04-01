import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        card: {
          bg: 'var(--card-bg)',
          border: 'var(--card-border)',
        },
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [forms, typography],
};

export default config;
