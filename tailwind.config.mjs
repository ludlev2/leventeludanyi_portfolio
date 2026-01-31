/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background colors
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          terminal: 'var(--bg-terminal)',
          elevated: 'var(--bg-elevated)',
          card: 'var(--bg-card)',
        },
        // Text colors
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        // Accent
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          muted: 'var(--accent-muted)',
        },
        // Borders
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
        // Shadows
        shadow: {
          DEFAULT: 'var(--shadow)',
          subtle: 'var(--shadow-subtle)',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Newsreader', 'Georgia', 'serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Newsreader', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.6875rem', { lineHeight: '1.5' }],
        'sm': ['0.8125rem', { lineHeight: '1.5' }],
        'base': ['0.875rem', { lineHeight: '1.6' }],
        'lg': ['1rem', { lineHeight: '1.6' }],
        'xl': ['1.125rem', { lineHeight: '1.5' }],
        '2xl': ['1.375rem', { lineHeight: '1.3' }],
        '3xl': ['1.75rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1.05' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      animation: {
        'cursor-blink': 'blink 1.2s step-end infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'terminal-open': 'terminalOpen 0.3s ease-out forwards',
        'terminal-close': 'terminalClose 0.2s ease-in forwards',
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
          '0%': { opacity: '0', transform: 'translateY(16px)' },
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
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--text-secondary)',
            '--tw-prose-headings': 'var(--text-primary)',
            '--tw-prose-links': 'var(--accent)',
            '--tw-prose-bold': 'var(--text-primary)',
            '--tw-prose-code': 'var(--text-primary)',
            '--tw-prose-pre-bg': 'var(--bg-terminal)',
            '--tw-prose-pre-code': 'var(--text-primary)',
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: 'var(--shadow-subtle)',
              padding: '0.2em 0.4em',
              border: '1px solid var(--border)',
              fontWeight: '400',
            },
            a: {
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border-hover)',
              transition: 'all 0.15s ease',
              '&:hover': {
                color: 'var(--accent)',
                borderBottomColor: 'var(--accent)',
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
