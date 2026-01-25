export const siteConfig = {
  title: 'Levente Ludanyi',
  description: 'Engineer, Founder, Builder. Co-Founder at Margin. Mathematics & Computer Science @ École Polytechnique.',
  siteUrl: 'https://ludanyi.me',
  author: 'Levente Ludanyi',
  email: 'levente@ludanyi.me',

  social: {
    github: 'https://github.com/ludlev2',
    twitter: 'https://x.com/LeventeLudanyi',
    linkedin: 'https://www.linkedin.com/in/levente-ludanyi/',
    spotify: 'https://open.spotify.com/user/12162121994',
  },

  nav: [
    { name: 'blog', href: '/blog' },
    { name: 'projects', href: '/projects' },
    { name: 'about', href: '/about' },
  ],

  // For terminal neofetch
  system: {
    os: 'Engineer × Founder',
    host: 'ludanyi.me',
    kernel: 'Astro + React',
    shell: 'Terminal Mode™',
    theme: 'Dark (always)',
    location: 'Building stuff',
    current: 'Co-Founder @ Margin',
    previous: 'École Polytechnique',
  },
} as const;

export type SiteConfig = typeof siteConfig;
