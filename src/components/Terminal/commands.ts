import { siteConfig } from '@/lib/site-config';
import {
  NEOFETCH_ASCII,
  SUDO_RESPONSE,
  VIM_RESPONSE,
  RM_RF_RESPONSE,
  NOT_FOUND,
} from './ascii-art';

export interface CommandResult {
  output: string;
  isHtml?: boolean;
  action?: 'clear' | 'navigate' | 'theme' | 'exit';
  actionPayload?: string;
}

type CommandHandler = (args: string[]) => CommandResult;

const FILESYSTEM = {
  '~': ['blog', 'projects', 'about.md', 'README.md'],
  '~/blog': ['javascript-promises.md', 'react-component-library.md', 'nx-tips.md'],
  '~/projects': ['pointswitch', 'liquidity-pools'],
};

let currentDir = '~';

const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: `
Commands
────────────────────

Navigation
  <span style="color: var(--accent)">ls</span>            List directory contents
  <span style="color: var(--accent)">cd</span> [dir]      Change directory
  <span style="color: var(--accent)">cat</span> [file]    Read a file
  <span style="color: var(--accent)">open</span> [page]   Open a page (blog, projects, about)

Info
  <span style="color: var(--accent)">whoami</span>        About me
  <span style="color: var(--accent)">neofetch</span>      System info
  <span style="color: var(--accent)">social</span>        Social links
  <span style="color: var(--accent)">contact</span>       Contact information

System
  <span style="color: var(--accent)">theme</span> [mode]  Toggle theme (dark/light)
  <span style="color: var(--accent)">clear</span>         Clear terminal
  <span style="color: var(--accent)">exit</span>          Close terminal

Use ↑↓ for command history, Tab for autocomplete.
`,
    isHtml: true,
  }),

  ls: () => {
    const contents = FILESYSTEM[currentDir as keyof typeof FILESYSTEM] || [];
    const formatted = contents
      .map((item) => {
        if (item.endsWith('.md')) {
          return `<span style="color: var(--text-secondary)">${item}</span>`;
        }
        return `<span style="color: var(--accent)">${item}/</span>`;
      })
      .join('  ');

    return {
      output: `${currentDir}\n${formatted || '(empty)'}`,
      isHtml: true,
    };
  },

  cd: (args) => {
    const target = args[0];

    if (!target || target === '~') {
      currentDir = '~';
      return { output: '' };
    }

    if (target === '..') {
      if (currentDir !== '~') {
        currentDir = '~';
      }
      return { output: '' };
    }

    const newPath = currentDir === '~' ? `~/${target}` : `${currentDir}/${target}`;

    if (FILESYSTEM[newPath as keyof typeof FILESYSTEM]) {
      currentDir = newPath;
      return { output: '' };
    }

    // Check if it's a navigable page
    if (['blog', 'projects', 'about'].includes(target)) {
      return {
        output: `Navigating to /${target}...`,
        action: 'navigate',
        actionPayload: `/${target}`,
      };
    }

    return { output: `cd: ${target}: No such directory` };
  },

  cat: (args) => {
    const file = args[0];

    if (!file) {
      return { output: 'cat: missing file operand' };
    }

    if (file === 'about.md' || file === 'README.md') {
      return {
        output: `
Levente Ludanyi
────────────────────

Engineer & Founder. Building things that matter.

Currently
  Co-Founder @ Margin (viewmargin.com)

Previously
  Mathematics & Computer Science @ École Polytechnique

Interests
  Marathons, Ironmans, Calisthenics, Water Polo

Run 'open about' to see the full page.
`,
      };
    }

    return { output: `cat: ${file}: No such file` };
  },

  open: (args) => {
    const page = args[0];

    if (!page) {
      return { output: 'Usage: open [blog|projects|about]' };
    }

    const validPages = ['blog', 'projects', 'about'];

    if (validPages.includes(page)) {
      return {
        output: `Opening /${page}...`,
        action: 'navigate',
        actionPayload: `/${page}`,
      };
    }

    // Check if it's a URL
    if (page.startsWith('http')) {
      return {
        output: `Opening ${page}...`,
        action: 'navigate',
        actionPayload: page,
      };
    }

    return { output: `Unknown page: ${page}\nTry: blog, projects, about` };
  },

  whoami: () => ({
    output: `
Levente Ludanyi
────────────────────

Engineer, founder, and builder of things.

Currently building Margin — helping creators and businesses
understand their margins and make better decisions.

When not coding, probably running a marathon, doing an
Ironman, or playing water polo.

Education: École Polytechnique (Maths & CS)
           ...dropped out for the tech bro credibility.

Contact: ${siteConfig.email}
`,
  }),

  neofetch: () => ({
    output: `<pre style="color: var(--accent)">${NEOFETCH_ASCII}</pre>`,
    isHtml: true,
  }),

  social: () => ({
    output: `
Social
────────────────────

  GitHub    ${siteConfig.social.github}
  Twitter   ${siteConfig.social.twitter}
  LinkedIn  ${siteConfig.social.linkedin}
  Spotify   ${siteConfig.social.spotify}
`,
  }),

  contact: () => ({
    output: `
Contact
────────────────────

  Email     ${siteConfig.email}
  Twitter   ${siteConfig.social.twitter}
  LinkedIn  ${siteConfig.social.linkedin}

Feel free to reach out.
`,
  }),

  theme: (args) => {
    const theme = args[0];

    if (!theme) {
      const current = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      return { output: `Current theme: ${current}\nUsage: theme [dark|light]` };
    }

    if (theme === 'dark' || theme === 'light') {
      return {
        output: `Theme set to ${theme}`,
        action: 'theme',
        actionPayload: theme,
      };
    }

    return { output: 'Usage: theme [dark|light]' };
  },

  clear: () => ({
    output: '',
    action: 'clear',
  }),

  history: () => ({
    output: 'Use ↑/↓ arrow keys to navigate command history.',
  }),

  exit: () => ({
    output: 'Goodbye.',
    action: 'exit',
  }),

  // Easter eggs
  sudo: () => ({
    output: SUDO_RESPONSE,
  }),

  vim: () => ({
    output: VIM_RESPONSE,
  }),

  nvim: () => ({
    output: VIM_RESPONSE,
  }),

  'rm': (args) => {
    if (args.includes('-rf') || args.includes('-fr')) {
      return { output: RM_RF_RESPONSE };
    }
    return { output: 'rm: missing operand' };
  },

  pwd: () => ({
    output: currentDir,
  }),

  echo: (args) => ({
    output: args.join(' '),
  }),

  date: () => ({
    output: new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }),

  whoismycrush: () => ({
    output: `
Analyzing terminal usage patterns...

Based on the evidence, your crush is probably:
  • A well-documented API
  • Clean code with no bugs
  • Someone who uses vim

Type 'exit' to close and touch grass.
`,
  }),
};

export function executeCommand(input: string): CommandResult {
  const trimmed = input.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  if (!cmd) {
    return { output: '' };
  }

  const handler = commands[cmd];

  if (handler) {
    return handler(args);
  }

  return { output: NOT_FOUND(cmd) };
}

export function getCommandSuggestions(partial: string): string[] {
  if (!partial) return [];

  const parts = partial.toLowerCase().split(/\s+/);
  const cmd = parts[0];
  const arg = parts[1] || '';

  // If we're still typing the command (no space yet)
  if (parts.length === 1) {
    return Object.keys(commands)
      .filter((c) => c.startsWith(cmd))
      .map((c) => c);
  }

  // We have a command and are typing an argument
  const commandsWithFilesystem = ['cd', 'ls'];
  const commandsWithPages = ['open'];
  const commandsWithTheme = ['theme'];
  const commandsWithFiles = ['cat'];

  if (commandsWithFilesystem.includes(cmd)) {
    // Get current directory contents
    const contents = FILESYSTEM[currentDir as keyof typeof FILESYSTEM] || [];
    const dirs = contents.filter((item) => !item.endsWith('.md'));

    // Add parent directory option
    const suggestions = currentDir !== '~' ? ['..', ...dirs] : dirs;

    const matches = suggestions.filter((d) => d.startsWith(arg));
    if (matches.length > 0) {
      return [`${cmd} ${matches[0]}`];
    }
  }

  if (commandsWithFiles.includes(cmd)) {
    // Get files in current directory
    const contents = FILESYSTEM[currentDir as keyof typeof FILESYSTEM] || [];
    const files = contents.filter((item) => item.endsWith('.md'));

    const matches = files.filter((f) => f.startsWith(arg));
    if (matches.length > 0) {
      return [`${cmd} ${matches[0]}`];
    }
  }

  if (commandsWithPages.includes(cmd)) {
    const pages = ['blog', 'projects', 'about'];
    const matches = pages.filter((p) => p.startsWith(arg));
    if (matches.length > 0) {
      return [`${cmd} ${matches[0]}`];
    }
  }

  if (commandsWithTheme.includes(cmd)) {
    const themes = ['dark', 'light'];
    const matches = themes.filter((t) => t.startsWith(arg));
    if (matches.length > 0) {
      return [`${cmd} ${matches[0]}`];
    }
  }

  return [];
}
