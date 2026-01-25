/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode (default)
        bg: {
          primary: '#0a0a0a',
          secondary: '#141414',
          terminal: '#0d1117',
          elevated: '#1a1a1a',
        },
        // Text colors
        text: {
          primary: '#e5e5e5',
          secondary: '#a3a3a3',
          muted: '#525252',
        },
        // Accent - Terminal green
        accent: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
          muted: '#166534',
          glow: 'rgba(34, 197, 94, 0.15)',
        },
        // Light mode overrides
        light: {
          bg: '#fafafa',
          'bg-secondary': '#f5f5f5',
          text: '#171717',
          'text-secondary': '#525252',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['JetBrains Mono', 'system-ui', 'sans-serif'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'terminal-open': 'terminalOpen 0.3s ease-out forwards',
        'terminal-close': 'terminalClose 0.2s ease-in forwards',
        'typing': 'typing 2s steps(20) forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        terminalOpen: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        terminalClose: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#e5e5e5',
            '--tw-prose-headings': '#e5e5e5',
            '--tw-prose-links': '#22c55e',
            '--tw-prose-bold': '#e5e5e5',
            '--tw-prose-code': '#22c55e',
            '--tw-prose-pre-bg': '#0d1117',
            '--tw-prose-pre-code': '#e5e5e5',
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: '#1a1a1a',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            a: {
              textDecoration: 'none',
              borderBottom: '1px solid #22c55e',
              transition: 'border-color 0.2s',
              '&:hover': {
                borderBottomWidth: '2px',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
