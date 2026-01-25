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
Available commands:

  <span class="text-accent">help</span>        Show this help message
  <span class="text-accent">ls</span>          List directory contents
  <span class="text-accent">cd</span> &lt;dir&gt;    Change directory (blog, projects, about)
  <span class="text-accent">cat</span> &lt;file&gt;  Read a file
  <span class="text-accent">open</span> &lt;page&gt; Open a page in the browser

  <span class="text-accent">whoami</span>      About me
  <span class="text-accent">neofetch</span>    System info (the fun kind)
  <span class="text-accent">social</span>      Show social links
  <span class="text-accent">contact</span>     Contact information

  <span class="text-accent">theme</span> &lt;dark|light&gt;  Toggle theme
  <span class="text-accent">clear</span>       Clear the terminal
  <span class="text-accent">history</span>     Show command history
  <span class="text-accent">exit</span>        Close terminal (or press Esc)

Pro tip: Use ↑/↓ arrows to navigate command history.
`,
    isHtml: true,
  }),

  ls: () => {
    const contents = FILESYSTEM[currentDir as keyof typeof FILESYSTEM] || [];
    const formatted = contents
      .map((item) => {
        if (item.endsWith('.md')) {
          return `<span class="text-text-secondary">${item}</span>`;
        }
        return `<span class="text-accent">${item}/</span>`;
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
# Levente Ludanyi

Engineer & Founder. Building things that matter.

## Currently
- Co-Founder @ Margin (viewmargin.com)

## Previously
- Mathematics & Computer Science @ École Polytechnique

## Interests
- Marathons, Ironmans, Calisthenics, Water Polo
- Building startups
- Web3 & DeFi

Run 'open about' to see the full about page.
`,
      };
    }

    return { output: `cat: ${file}: No such file` };
  },

  open: (args) => {
    const page = args[0];

    if (!page) {
      return { output: 'open: missing page argument\nUsage: open <blog|projects|about>' };
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

    return { output: `open: ${page}: not a valid page\nTry: blog, projects, about` };
  },

  whoami: () => ({
    output: `
Levente Ludanyi
─────────────────

Engineer, founder, and builder of things.

Currently building Margin - helping creators and businesses
understand their margins and make better decisions.

When not coding, I'm probably running a marathon, doing an Ironman,
or playing water polo. Yes, all of them.

Education: École Polytechnique (Mathematics & Computer Science)
           ...but I dropped out. Gotta get that tech bro credibility.

Contact: ${siteConfig.email}
`,
  }),

  neofetch: () => ({
    output: `<pre class="text-accent">${NEOFETCH_ASCII}</pre>`,
    isHtml: true,
  }),

  social: () => ({
    output: `
Social Links
────────────

  GitHub:   ${siteConfig.social.github}
  Twitter:  ${siteConfig.social.twitter}
  LinkedIn: ${siteConfig.social.linkedin}
  Spotify:  ${siteConfig.social.spotify}
`,
  }),

  contact: () => ({
    output: `
Contact
───────

  Email:    ${siteConfig.email}
  Twitter:  ${siteConfig.social.twitter}
  LinkedIn: ${siteConfig.social.linkedin}

Feel free to reach out! I don't bite (usually).
`,
  }),

  theme: (args) => {
    const theme = args[0];

    if (!theme) {
      return { output: 'Current theme: dark\nUsage: theme <dark|light>' };
    }

    if (theme === 'dark' || theme === 'light') {
      return {
        output: `Theme set to ${theme}`,
        action: 'theme',
        actionPayload: theme,
      };
    }

    return { output: 'theme: invalid option\nUsage: theme <dark|light>' };
  },

  clear: () => ({
    output: '',
    action: 'clear',
  }),

  history: () => ({
    output: 'Command history is shown with ↑/↓ arrow keys.',
  }),

  exit: () => ({
    output: 'Goodbye! 👋',
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
    output: new Date().toString(),
  }),

  whoismycrush: () => ({
    output: `
🤔 Hmm, let me think...

After careful analysis of your browsing history and terminal usage patterns...

Just kidding. I don't have access to that.

But based on the fact that you're using a terminal on a portfolio website,
I'd say your crush is probably:
- A well-documented API
- Clean code with no bugs
- Or maybe just someone who uses vim

Type 'exit' to close this terminal and touch grass.
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

  return Object.keys(commands).filter((cmd) =>
    cmd.startsWith(partial.toLowerCase())
  );
}
