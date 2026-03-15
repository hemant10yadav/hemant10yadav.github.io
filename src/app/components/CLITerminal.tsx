'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useViewer } from '../context/ViewerContext';
import {
  FULL_NAME, EMAIL, MAILTO, GITHUB_URL, GITHUB_USERNAME,
  LINKEDIN_URL, LINKEDIN_HANDLE, SO_URL,
  RESUME_PDF_URL, RESUME_VIEW_URL,
  DIMAGI, XCALIBER,
  PROJECT_ECOMMERCE, PROJECT_ESTORE, PROJECT_BOOKSTORE,
} from '../constants';

// ── types ─────────────────────────────────────────────────────────────────────

type LineColor = 'dim' | 'muted' | 'normal' | 'accent' | 'green' | 'red' | 'orange' | 'blue' | 'white';

interface Line {
  text: string;
  color?: LineColor;
  href?: string;
}

interface HistoryEntry {
  id: number;
  cmd: string | null;
  output: Line[];
  processing?: boolean;
  typewriter?: boolean;
}

// ── data ──────────────────────────────────────────────────────────────────────

const WELCOME: Line[] = [
  { text: '╔════════════════════════════════════════════════════╗', color: 'dim' },
  { text: '║   hemant@portfolio  ·  v2.0.0  ·  interactive cli  ║', color: 'accent' },
  { text: '╚════════════════════════════════════════════════════╝', color: 'dim' },
  { text: '' },
  { text: "  Type 'help' to see all commands.", color: 'muted' },
  { text: '  Some files are hidden. Explore.', color: 'dim' },
  { text: '' },
];

const STATIC_COMMANDS: Record<string, Line[]> = {
  whoami: [
    { text: FULL_NAME, color: 'accent' },
    { text: 'Software Engineer · 4+ years', color: 'normal' },
    { text: `Currently @ ${DIMAGI.name}`, color: 'muted' },
    { text: '' },
    { text: '"I build for the person on-call at 3am."', color: 'dim' },
  ],

  about: [
    { text: 'Software engineer.', color: 'normal' },
    { text: '' },
    { text: 'Spent 4 years closing the gap between', color: 'muted' },
    { text: '"works on my machine" and "works for 10,000 users."', color: 'accent' },
    { text: '' },
    { text: 'I like systems that are boring to operate.', color: 'dim' },
    { text: 'Boring means nothing is on fire.', color: 'dim' },
  ],

  skills: [
    { text: 'Backend    Python · Django · Java · Spring Boot', color: 'normal' },
    { text: 'Frontend   React · Angular · TypeScript · Tailwind', color: 'normal' },
    { text: 'Infra      AWS · Docker · PostgreSQL · MongoDB', color: 'normal' },
    { text: 'Tools      Git · REST APIs · Hibernate · Node.js', color: 'normal' },
  ],

  experience: [
    { text: `● ${DIMAGI.period}`, color: 'accent' },
    { text: `  ${DIMAGI.name} · Software Engineer · ${DIMAGI.location}`, color: 'normal' },
    { text: '  Systems serving frontline health workers in 130+ countries.', color: 'muted' },
    { text: '  Python · Django · Docker · AWS · PostgreSQL', color: 'dim' },
    { text: '' },
    { text: `○ ${XCALIBER.period}`, color: 'normal' },
    { text: `  ${XCALIBER.name} · Software Engineer · ${XCALIBER.location}`, color: 'normal' },
    { text: '  Spring Boot APIs powering web, Android, iOS simultaneously.', color: 'muted' },
    { text: '  Spring Boot · Angular · Hibernate · Amazon S3', color: 'dim' },
  ],

  projects: [
    { text: `01 · ${PROJECT_ECOMMERCE.title}`, color: 'accent' },
    { text: '   Spring Boot + Angular + PostgreSQL', color: 'muted' },
    { text: `   ↗ ${PROJECT_ECOMMERCE.githubUrl.replace('https://', '')}`, color: 'blue', href: PROJECT_ECOMMERCE.githubUrl },
    { text: '' },
    { text: `02 · ${PROJECT_ESTORE.title}`, color: 'accent' },
    { text: '   MERN stack — MongoDB, Express, React, Node', color: 'muted' },
    { text: `   ↗ ${PROJECT_ESTORE.githubUrl.replace('https://', '')}`, color: 'blue', href: PROJECT_ESTORE.githubUrl },
    { text: '' },
    { text: `03 · ${PROJECT_BOOKSTORE.title}  [live demo]`, color: 'accent' },
    { text: '   Angular + Google Books API', color: 'muted' },
    { text: `   ↗ ${PROJECT_BOOKSTORE.demoUrl.replace('https://', '')}`, color: 'blue', href: PROJECT_BOOKSTORE.demoUrl },
  ],

  contact: [
    { text: `Email     ${EMAIL}`,                                color: 'normal', href: MAILTO },
    { text: `GitHub    github.com/${GITHUB_USERNAME}`,           color: 'normal', href: GITHUB_URL },
    { text: `LinkedIn  linkedin.com/in/${LINKEDIN_HANDLE}`,      color: 'normal', href: LINKEDIN_URL },
    { text: `Stack     ${SO_URL.replace('https://', '')}`,       color: 'normal', href: SO_URL },
  ],

  resume: [
    { text: '↗ View online',   color: 'blue', href: RESUME_VIEW_URL },
    { text: '↓ Download PDF',  color: 'blue', href: RESUME_PDF_URL },
  ],

  ls: [
    { text: 'about/     contact/     experience/     projects/     skills/', color: 'accent' },
    { text: '' },
    { text: "// use 'ls -la' to see everything", color: 'dim' },
  ],

  'ls -la': [
    { text: 'total 42', color: 'dim' },
    { text: 'drwxr-xr-x  about/', color: 'normal' },
    { text: 'drwxr-xr-x  contact/', color: 'normal' },
    { text: 'drwxr-xr-x  experience/', color: 'normal' },
    { text: 'drwxr-xr-x  projects/', color: 'normal' },
    { text: 'drwxr-xr-x  skills/', color: 'normal' },
    { text: 'drwx------  .mistakes/', color: 'red' },
  ],

  'ls -a': [
    { text: 'about/  contact/  experience/  projects/  skills/  .mistakes/', color: 'normal' },
  ],

  'll': [
    { text: 'total 42', color: 'dim' },
    { text: 'drwxr-xr-x  about/', color: 'normal' },
    { text: 'drwxr-xr-x  contact/', color: 'normal' },
    { text: 'drwxr-xr-x  experience/', color: 'normal' },
    { text: 'drwxr-xr-x  projects/', color: 'normal' },
    { text: 'drwxr-xr-x  skills/', color: 'normal' },
    { text: 'drwx------  .mistakes/', color: 'red' },
  ],

  'ls .mistakes/': [
    { text: 'production.log', color: 'orange' },
    { text: '' },
    { text: '// cat ~/.mistakes/production.log', color: 'dim' },
  ],

  'cat ~/.mistakes/production.log': [
    { text: 'LOADING 6 ENTRIES...', color: 'dim' },
    { text: '' },
    { text: '[2022-06-18]  INCIDENT', color: 'red' },
    { text: '  Added new functionality to the editor for Android.', color: 'normal' },
    { text: '  // Later discovered it crashes on iPhone.', color: 'muted' },
    { text: '' },
    { text: '[2023-03-12]  PROD', color: 'red' },
    { text: '  Ran a migration that contained a logic bug.', color: 'normal' },
    { text: '  // Corrupted table data. Had to debug and repair manually.', color: 'muted' },
    { text: '' },
    { text: '[2023-09-05]  DEBUG', color: 'orange' },
    { text: '  Built a feature on top of existing one, updated logic in most places.', color: 'normal' },
    { text: '  // Missed one edge case. Production broke later.', color: 'muted' },
    { text: '' },
    { text: '[2024-02-21]  HUBRIS', color: 'orange' },
    { text: "  Pushed a 'simple one-line fix' to production without testing.", color: 'normal' },
    { text: '  // It broke the notification system.', color: 'muted' },
    { text: '' },
    { text: '[2024-07-30]  REVIEW', color: 'red' },
    { text: '  Tested the feature on staging using only a superuser account.', color: 'normal' },
    { text: '  // Permissions failed for normal users in production.', color: 'muted' },
    { text: '' },
    { text: '[2026-01-16]  PROD', color: 'red' },
    { text: '  Forgot to create the PostGIS extension on the secondary database.', color: 'normal' },
    { text: '  // Deployment failed when spatial queries started running.', color: 'muted' },
    { text: '' },
    { text: '────────────────────────────────────────────────────', color: 'dim' },
    { text: 'EOF', color: 'dim' },
    { text: '// 6 logged. more pending review. growth in progress.', color: 'dim' },
  ],

  pwd: [{ text: '/home/visitor/hemant-portfolio', color: 'normal' }],
  uname: [{ text: 'hemant-portfolio Darwin 24.0.0 arm64', color: 'normal' }],
  'echo $USER': [{ text: 'visitor', color: 'normal' }],

  env: [
    { text: 'USER=visitor', color: 'normal' },
    { text: `HOME=/home/visitor/${GITHUB_USERNAME}-portfolio`, color: 'normal' },
    { text: 'SHELL=/bin/zsh', color: 'normal' },
    { text: 'STACK=python:django:react:aws', color: 'accent' },
    { text: 'COFFEE_CONSUMED=∞', color: 'normal' },
    { text: 'BUGS_FIXED=many', color: 'green' },
    { text: 'BUGS_INTRODUCED=some', color: 'orange' },
    { text: 'DEADLINE=soon™', color: 'red' },
    { text: 'CURRENT_MOOD=building', color: 'normal' },
    { text: 'IMPOSTOR_SYNDROME=disabled', color: 'green' },
  ],

  alias: [
    { text: "alias ll='ls -la'", color: 'normal' },
    { text: "alias cls='clear'", color: 'normal' },
    { text: "alias hire='sudo hire-me'", color: 'normal' },
    { text: "alias fix='git commit -m \"fix\"'", color: 'normal' },
  ],

  'cat /etc/motivation': [
    { text: 'Build things that matter.', color: 'accent' },
    { text: 'Ship when ready, not when perfect.', color: 'normal' },
    { text: 'Read the error message.', color: 'muted' },
    { text: 'Then read it again.', color: 'dim' },
  ],

  'sudo hire-me': [
    { text: '[sudo] password for visitor: ', color: 'normal' },
    { text: 'Sorry, try again.', color: 'red' },
    { text: '[sudo] password for visitor: ', color: 'normal' },
    { text: 'sudo: 3 incorrect password attempts', color: 'red' },
    { text: '' },
    { text: `...but seriously. ${EMAIL}`, color: 'accent', href: MAILTO },
  ],

  'rm -rf bugs': [
    { text: "rm: cannot remove 'bugs': Permission denied", color: 'red' },
    { text: '(they always come back anyway)', color: 'dim' },
  ],

  'rm -rf .': [
    { text: "rm: refusing to remove '.' or '..' directory", color: 'red' },
    { text: '(nice try.)', color: 'dim' },
  ],

  'git blame': [
    { text: "fatal: no repository found in '.'", color: 'red' },
    { text: '' },
    { text: "...though if you're looking for someone to blame,", color: 'muted' },
    { text: "that's probably me. — Hemant", color: 'dim' },
  ],

  'git log': [
    { text: 'commit a3f2b1c (HEAD -> main)', color: 'orange' },
    { text: `Author: ${FULL_NAME} <${EMAIL}>`, color: 'muted' },
    { text: `Date:   ${DIMAGI.period.split(' — ')[0]}`, color: 'dim' },
    { text: '' },
    { text: `    feat: joined ${DIMAGI.name}`, color: 'normal' },
    { text: '' },
    { text: 'commit 7d89e2a (origin/xcaliber)', color: 'orange' },
    { text: `Author: ${FULL_NAME} <${EMAIL}>`, color: 'muted' },
    { text: `Date:   ${XCALIBER.period.split(' — ')[0]}`, color: 'dim' },
    { text: '' },
    { text: `    feat: joined ${XCALIBER.name}`, color: 'normal' },
  ],

  'git status': [
    { text: 'On branch main', color: 'normal' },
    { text: "Your branch is up to date with 'origin/main'.", color: 'green' },
    { text: '' },
    { text: 'Changes not staged for commit:', color: 'normal' },
    { text: '  modified:   life/career.json', color: 'red' },
    { text: '  modified:   skills/still-learning.md', color: 'red' },
    { text: '' },
    { text: 'no changes added to commit', color: 'muted' },
  ],

  'ssh hemant': [
    { text: 'ssh: connect to host hemant port 22: Connection refused', color: 'red' },
    { text: '(try email instead)', color: 'dim' },
    { text: `↗ ${EMAIL}`, color: 'blue', href: MAILTO },
  ],

  exit: [
    { text: 'logout', color: 'dim' },
    { text: "(you can't leave. scroll up.)", color: 'accent' },
  ],

  vim: [
    { text: '-- INSERT --', color: 'normal' },
    { text: '' },
    { text: 'just kidding. you are not in vim.', color: 'muted' },
    { text: "(but if you were, it's :q to quit)", color: 'dim' },
  ],

  nano: [
    { text: "nano: command not found", color: 'red' },
    { text: '(use vim. just kidding. use VS Code.)', color: 'dim' },
  ],

  neofetch: [
    { text: `          ██████           visitor@${GITHUB_USERNAME}`, color: 'accent' },
    { text: '        ██      ██         ─────────────────────────', color: 'accent' },
    { text: '      ██  ████  ██         OS: Portfolio v2.0.0', color: 'normal' },
    { text: '      ██  ████  ██         Shell: zsh', color: 'normal' },
    { text: '        ██████             Stack: Python · Django · React', color: 'normal' },
    { text: '      ██      ██           Theme: dark (obviously)', color: 'normal' },
    { text: '    ████████████████       Memory: full of coffee', color: 'normal' },
    { text: '                           Uptime: 4 years', color: 'muted' },
    { text: '                           Caffeine: critical', color: 'dim' },
  ],

  'curl ifconfig.me': [
    { text: "you're visiting from somewhere on the internet.", color: 'normal' },
    { text: "(that's all I know. and all I need to know.)", color: 'dim' },
  ],

  'npm install talent': [
    { text: 'npm warn deprecated shortcuts@1.0.0', color: 'orange' },
    { text: '' },
    { text: 'added 1 package in 4 years', color: 'green' },
    { text: '' },
    { text: '1 package is looking for funding', color: 'muted' },
    { text: '  run `npm fund` for details', color: 'dim' },
  ],

  'ping google.com': [
    { text: 'PING google.com: 56 data bytes', color: 'normal' },
    { text: '64 bytes from 142.250.80.46: icmp_seq=0 ttl=116 time=12.3 ms', color: 'muted' },
    { text: '64 bytes from 142.250.80.46: icmp_seq=1 ttl=116 time=11.8 ms', color: 'muted' },
    { text: '64 bytes from 142.250.80.46: icmp_seq=2 ttl=116 time=13.1 ms', color: 'muted' },
    { text: '' },
    { text: '--- google.com ping statistics ---', color: 'dim' },
    { text: '3 packets transmitted, 3 received, 0% packet loss', color: 'green' },
    { text: '(now hire me to build fast systems)', color: 'dim' },
  ],
};

// ── man pages ─────────────────────────────────────────────────────────────────

const MAN_PAGES: Record<string, Line[]> = {
  ls: [
    { text: 'LS(1)              Portfolio Manual             LS(1)', color: 'dim' },
    { text: '' },
    { text: 'NAME', color: 'white' },
    { text: '     ls — list portfolio contents', color: 'normal' },
    { text: '' },
    { text: 'SYNOPSIS', color: 'white' },
    { text: '     ls [-la] [-a] [directory]', color: 'normal' },
    { text: '' },
    { text: 'OPTIONS', color: 'white' },
    { text: '     -la   long format, show hidden files', color: 'normal' },
    { text: '     -a    show all including dotfiles', color: 'normal' },
    { text: '' },
    { text: 'EXAMPLES', color: 'white' },
    { text: "     ls -la        # reveals hidden directories", color: 'muted' },
    { text: "     ls .mistakes/ # peek inside", color: 'muted' },
  ],
  cat: [
    { text: 'CAT(1)             Portfolio Manual             CAT(1)', color: 'dim' },
    { text: '' },
    { text: 'NAME', color: 'white' },
    { text: '     cat — display file contents', color: 'normal' },
    { text: '' },
    { text: 'EXAMPLES', color: 'white' },
    { text: '     cat /etc/motivation', color: 'muted' },
    { text: '     cat ~/.mistakes/production.log', color: 'muted' },
  ],
  grep: [
    { text: 'GREP(1)            Portfolio Manual             GREP(1)', color: 'dim' },
    { text: '' },
    { text: 'NAME', color: 'white' },
    { text: '     grep — search lines matching a pattern', color: 'normal' },
    { text: '' },
    { text: 'SYNOPSIS', color: 'white' },
    { text: '     command | grep <pattern>', color: 'normal' },
    { text: '' },
    { text: 'EXAMPLES', color: 'white' },
    { text: '     ls -la | grep mistakes', color: 'muted' },
    { text: '     git log | grep Xcaliber', color: 'muted' },
    { text: '     experience | grep Django', color: 'muted' },
  ],
  whoami: [
    { text: 'WHOAMI(1)          Portfolio Manual          WHOAMI(1)', color: 'dim' },
    { text: '' },
    { text: 'NAME', color: 'white' },
    { text: '     whoami — display effective user identity', color: 'normal' },
    { text: '' },
    { text: 'DESCRIPTION', color: 'white' },
    { text: '     Shows the portfolio owner identity.', color: 'normal' },
    { text: `     Spoiler: it's ${FULL_NAME}.`, color: 'dim' },
  ],
  git: [
    { text: 'GIT(1)             Portfolio Manual              GIT(1)', color: 'dim' },
    { text: '' },
    { text: 'AVAILABLE SUBCOMMANDS', color: 'white' },
    { text: '     git log        career history', color: 'normal' },
    { text: '     git blame      find who to blame', color: 'normal' },
    { text: '     git status     current state of things', color: 'normal' },
  ],
  mode: [
    { text: 'MODE(1)            Portfolio Manual            MODE(1)', color: 'dim' },
    { text: '' },
    { text: 'NAME', color: 'white' },
    { text: '     mode — switch between recruiter and developer view', color: 'normal' },
    { text: '' },
    { text: 'DESCRIPTION', color: 'white' },
    { text: '     Toggles the entire portfolio between two modes.', color: 'normal' },
    { text: '     Changes content, accent color, and visible sections.', color: 'muted' },
  ],
};

// ── slow commands (show processing spinner before output) ─────────────────────

const SLOW_COMMANDS = new Set([
  'cat ~/.mistakes/production.log',
  'ping google.com',
  'npm install talent',
  'neofetch',
  'git log',
]);

// ── completion list ───────────────────────────────────────────────────────────

const ALL_CMDS = [
  'help', 'whoami', 'about', 'skills', 'experience', 'projects',
  'contact', 'resume', 'mode', 'clear', 'history', 'ls', 'ls -la',
  'ls -a', 'll', 'ls .mistakes/', 'pwd', 'uname', 'env', 'alias',
  'neofetch', 'vim', 'nano', 'exit', 'date', 'echo', 'grep',
  'git log', 'git blame', 'git status', 'ssh hemant',
  'sudo hire-me', 'rm -rf bugs', 'curl ifconfig.me',
  'npm install talent', 'cat /etc/motivation',
  'cat ~/.mistakes/production.log', 'ping google.com',
  'echo $USER', 'man',
];

// ── helpers ───────────────────────────────────────────────────────────────────

function resolveColor(color: LineColor | undefined, accent: string): string {
  switch (color) {
    case 'dim':    return '#2d3f55';
    case 'muted':  return '#475569';
    case 'normal': return '#94a3b8';
    case 'accent': return accent;
    case 'green':  return '#22c55e';
    case 'red':    return '#ef4444';
    case 'orange': return '#f97316';
    case 'blue':   return '#38bdf8';
    case 'white':  return '#e2e8f0';
    default:       return '#94a3b8';
  }
}

function getHelp(viewerType: string): Line[] {
  const otherMode = viewerType === 'recruiter' ? 'developer' : 'recruiter';
  return [
    { text: '┌── Commands ─────────────────────────────────────────────┐', color: 'dim' },
    { text: '│', color: 'dim' },
    { text: '│  whoami       who am I?', color: 'normal' },
    { text: '│  about        background & philosophy', color: 'normal' },
    { text: '│  skills       tech stack', color: 'normal' },
    { text: '│  experience   work history', color: 'normal' },
    { text: '│  projects     things I built', color: 'normal' },
    { text: '│  contact      reach me', color: 'normal' },
    { text: '│  resume       view / download resume', color: 'normal' },
    { text: `│  mode         switch to ${otherMode} view`, color: 'normal' },
    { text: '│  history      recent commands', color: 'normal' },
    { text: '│  man <cmd>    read the manual', color: 'normal' },
    { text: '│  clear        clear terminal', color: 'normal' },
    { text: '│', color: 'dim' },
    { text: '│  Tab          autocomplete / show all matches', color: 'dim' },
    { text: '│  ↑ / ↓        command history', color: 'dim' },
    { text: '│  Ctrl+R       reverse history search', color: 'dim' },
    { text: '│  Ctrl+L       clear screen', color: 'dim' },
    { text: '│  Ctrl+A/E     start / end of line', color: 'dim' },
    { text: '│  Ctrl+W       delete last word', color: 'dim' },
    { text: '│  Ctrl+U       clear line', color: 'dim' },
    { text: '│', color: 'dim' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'dim' },
    { text: '' },
    { text: '  Some files are hidden. Explore with ls.', color: 'dim' },
    { text: '  Click any output line to copy it.', color: 'dim' },
  ];
}

// Returns output lines for a given command (used by pipe)
function getCommandOutput(cmd: string, viewerType: string): Line[] {
  const lower = cmd.trim().toLowerCase();
  if (lower === 'help') return getHelp(viewerType);
  if (lower in STATIC_COMMANDS) return STATIC_COMMANDS[lower];
  return [{ text: `command not found: ${lower}`, color: 'red' }];
}

// Fuzzy "did you mean?" — finds closest command name
function findSimilar(input: string, commands: string[]): string | null {
  if (input.length < 2) return null;
  const prefix = input.slice(0, Math.min(3, input.length)).toLowerCase();
  return commands.find(c => c !== input && (c.startsWith(prefix) || c.includes(prefix))) ?? null;
}

// Reverse search through command history
function findInHistory(history: string[], query: string): string {
  if (!query) return '';
  return history.find(c => c.toLowerCase().includes(query.toLowerCase())) ?? '';
}

// ── component ─────────────────────────────────────────────────────────────────

export default function CLITerminal() {
  const { viewerType, accent, toggleViewerType } = useViewer();

  const [entries, setEntries] = useState<HistoryEntry[]>([
    { id: 0, cmd: null, output: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIdx, setCmdIdx]         = useState(-1);
  const [isFocused, setIsFocused]   = useState(false);
  const [copiedId, setCopiedId]     = useState<string | null>(null);

  // Ctrl+R reverse search
  const [searchMode, setSearchMode]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const idRef    = useRef(1);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries]);

  // Global ` shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const pushEntry = useCallback((cmd: string, output: Line[], opts?: { typewriter?: boolean }) => {
    setEntries(prev => [...prev, { id: idRef.current++, cmd, output, typewriter: opts?.typewriter }]);
  }, []);

  const copyLine = useCallback((text: string, lineId: string) => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(lineId);
      setTimeout(() => setCopiedId(null), 1400);
    }).catch(() => {});
  }, []);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const lower = cmd.toLowerCase();

    setCmdHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setCmdIdx(-1);

    // ── pipe ────────────────────────────────────────────────────────────────
    if (cmd.includes('|')) {
      const parts = cmd.split('|').map(s => s.trim());
      let result = getCommandOutput(parts[0], viewerType);
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i].trim();
        if (part.startsWith('grep ')) {
          const pattern = part.slice(5).trim().toLowerCase();
          const filtered = result.filter(l => l.text.toLowerCase().includes(pattern));
          result = filtered.length
            ? filtered
            : [{ text: `grep: no matches for '${pattern}'`, color: 'red' }];
        }
      }
      pushEntry(cmd, result);
      return;
    }

    // ── built-ins ────────────────────────────────────────────────────────────
    if (lower === 'clear') {
      setEntries([{ id: idRef.current++, cmd: null, output: WELCOME }]);
      return;
    }

    if (lower === 'help') { pushEntry(cmd, getHelp(viewerType)); return; }

    if (lower === 'mode') {
      const next = viewerType === 'recruiter' ? 'developer' : 'recruiter';
      toggleViewerType();
      pushEntry(cmd, [
        { text: `✓ Switched to ${next} view.`, color: 'green' },
        { text: '  Scroll up — the whole site just changed.', color: 'dim' },
      ]);
      return;
    }

    if (lower === 'date') {
      pushEntry(cmd, [{ text: new Date().toLocaleString(), color: 'normal' }]);
      return;
    }

    if (lower.startsWith('echo ') && lower !== 'echo $user') {
      pushEntry(cmd, [{ text: cmd.slice(5), color: 'normal' }]);
      return;
    }

    if (lower === 'history') {
      pushEntry(cmd, cmdHistory.length
        ? cmdHistory.slice(0, 25).map((c, i) => ({
            text: `  ${String(cmdHistory.length - i).padStart(3)}  ${c}`,
            color: 'normal' as LineColor,
          }))
        : [{ text: 'No commands in history yet.', color: 'dim' }]);
      return;
    }

    if (lower.startsWith('man ')) {
      const target = lower.slice(4).trim();
      pushEntry(cmd, MAN_PAGES[target] ?? [
        { text: `No manual entry for ${target}`, color: 'red' },
        { text: '(try: man ls, man cat, man grep, man whoami, man git, man mode)', color: 'dim' },
      ]);
      return;
    }

    if (lower === 'grep' || (lower.startsWith('grep ') && !cmd.includes('|'))) {
      pushEntry(cmd, [
        { text: 'usage: command | grep <pattern>', color: 'red' },
        { text: 'example: ls -la | grep mistakes', color: 'dim' },
      ]);
      return;
    }

    // ── slow commands — show spinner then reveal output ──────────────────────
    if (SLOW_COMMANDS.has(lower)) {
      const entryId = idRef.current++;
      const isTypewriter = lower === 'cat ~/.mistakes/production.log';

      setEntries(prev => [...prev, { id: entryId, cmd, output: [], processing: true }]);

      const delay = 600 + Math.random() * 500;
      setTimeout(() => {
        setEntries(prev => prev.map(e =>
          e.id === entryId
            ? { ...e, output: STATIC_COMMANDS[lower] ?? [], processing: false, typewriter: isTypewriter }
            : e
        ));
      }, delay);
      return;
    }

    // ── static commands ──────────────────────────────────────────────────────
    if (lower in STATIC_COMMANDS) {
      pushEntry(cmd, STATIC_COMMANDS[lower]);
      return;
    }

    // ── did you mean? ────────────────────────────────────────────────────────
    const similar = findSimilar(lower, ALL_CMDS);
    const notFoundLines: Line[] = [
      { text: `zsh: command not found: ${cmd}`, color: 'red' },
      ...(similar ? [{ text: `Did you mean '${similar}'?`, color: 'dim' } as Line] : []),
      { text: "Type 'help' for available commands.", color: 'dim' },
    ];
    pushEntry(cmd, notFoundLines);
  }, [viewerType, toggleViewerType, pushEntry, cmdHistory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ── search mode ──────────────────────────────────────────────────────────
    if (searchMode) {
      if (e.key === 'Enter') {
        const found = findInHistory(cmdHistory, searchQuery);
        setSearchMode(false);
        setSearchQuery('');
        if (found) setInput(found);
      } else if (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey)) {
        setSearchMode(false);
        setSearchQuery('');
      } else if (e.key === 'Backspace') {
        setSearchQuery(prev => prev.slice(0, -1));
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
        setSearchQuery(prev => prev + e.key);
      }
      e.preventDefault();
      return;
    }

    // ── normal mode ──────────────────────────────────────────────────────────
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(cmdIdx - 1, -1);
      setCmdIdx(next);
      setInput(next === -1 ? '' : (cmdHistory[next] ?? ''));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = ALL_CMDS.filter(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        // Show all matches without executing
        pushEntry(input, [{ text: matches.join('   '), color: 'accent' }]);
      }
    } else if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          if (input) {
            pushEntry(input + '^C', []);
            setInput('');
          }
          break;
        case 'l':
          e.preventDefault();
          setEntries([{ id: idRef.current++, cmd: null, output: WELCOME }]);
          break;
        case 'a':
          e.preventDefault();
          setTimeout(() => inputRef.current?.setSelectionRange(0, 0));
          break;
        case 'e':
          e.preventDefault();
          setTimeout(() => inputRef.current?.setSelectionRange(input.length, input.length));
          break;
        case 'w': {
          e.preventDefault();
          const trimmed = input.trimEnd();
          const lastSpace = trimmed.lastIndexOf(' ');
          setInput(lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1));
          break;
        }
        case 'u':
          e.preventDefault();
          setInput('');
          break;
        case 'r':
          e.preventDefault();
          setSearchMode(true);
          setSearchQuery('');
          break;
      }
    }
  };

  const searchResult = searchMode ? findInHistory(cmdHistory, searchQuery) : '';

  return (
    <section
      id="terminal"
      style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem) 1.5rem 2rem',
        position: 'relative',
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Live indicator */}
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', width: '0.55rem', height: '0.55rem', borderRadius: '50%', background: accent, opacity: 0.35, animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: accent, display: 'block', position: 'relative' }} />
          </span>
          <h2 style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '1.6rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
            Terminal
          </h2>
          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '999px', border: `1px solid ${accent}25`, background: `${accent}08` }}>
            interactive
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            ['`', 'focus'],
            ['Ctrl+R', 'search'],
            ['Ctrl+L', 'clear'],
            ['Tab', 'complete'],
          ].map(([key, desc]) => (
            <span key={key} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6rem', color: '#2d3f55' }}>
              <span style={{ color: `${accent}90` }}>{key}</span> {desc}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Terminal window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={() => inputRef.current?.focus()}
        style={{
          background: '#0b1120',
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${isFocused ? `${accent}50` : 'rgba(255,255,255,0.12)'}`,
          boxShadow: isFocused
            ? `0 0 0 1px ${accent}20, 0 24px 60px rgba(0,0,0,0.6)`
            : '0 4px 6px rgba(0,0,0,0.3), 0 24px 60px rgba(0,0,0,0.5)',
          transition: 'border-color 0.25s, box-shadow 0.25s',
          cursor: 'text',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
        }}
      >
        {/* Chrome */}
        <div style={{ background: '#141c2e', padding: '0.65rem 1rem', borderBottom: `1px solid ${isFocused ? `${accent}18` : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', gap: '0.5rem', userSelect: 'none', transition: 'border-color 0.25s' }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
            <span key={c} style={{ width: '0.55rem', height: '0.55rem', borderRadius: '50%', background: c, display: 'block', opacity: 0.8 }} />
          ))}
          <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.68rem', color: '#334155', marginLeft: '0.4rem' }}>
            visitor@hemant — ~/portfolio
          </span>
          {isFocused && (
            <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: `${accent}60`, fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
              ● active
            </span>
          )}
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          style={{ height: 'clamp(360px, 55vh, 520px)', overflowY: 'auto', padding: '1rem 1.25rem 0.5rem', scrollbarWidth: 'thin', scrollbarColor: `${accent}25 transparent` }}
        >
          {entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: '0.5rem' }}>
              {entry.cmd !== null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <Prompt accent={accent} />
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.82rem', color: '#e2e8f0' }}>
                    {entry.cmd}
                  </span>
                </div>
              )}

              {entry.processing && <ProcessingDots accent={accent} />}

              {!entry.processing && entry.output.map((line, li) => (
                <OutputLine
                  key={li}
                  line={line}
                  index={li}
                  accent={accent}
                  slow={entry.typewriter}
                  lineId={`${entry.id}-${li}`}
                  copiedId={copiedId}
                  onCopy={copyLine}
                />
              ))}
            </div>
          ))}

          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
            {searchMode ? (
              // Ctrl+R search mode
              <>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', color: accent, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  (reverse-i-search)`{searchQuery}&apos;:
                </span>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.82rem', color: '#e2e8f0', flex: 1 }}>
                  {searchResult}
                  <span style={{ display: 'inline-block', width: '0.45rem', height: '0.9rem', background: accent, opacity: 0.7, marginLeft: '1px', animation: 'blink 1.1s step-end infinite', verticalAlign: 'text-bottom' }} />
                </span>
              </>
            ) : (
              <>
                <Prompt accent={accent} />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.82rem', color: '#e2e8f0', caretColor: accent, minWidth: 0 }}
                />
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Copy toast */}
      {copiedId && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ position: 'absolute', bottom: '3.5rem', right: '1.5rem', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.65rem', color: accent, background: `${accent}15`, border: `1px solid ${accent}30`, padding: '0.25rem 0.6rem', borderRadius: '6px', pointerEvents: 'none' }}
        >
          ✓ copied
        </motion.div>
      )}
    </section>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function Prompt({ accent }: { accent: string }) {
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', userSelect: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
      <span style={{ color: '#475569' }}>visitor</span>
      <span style={{ color: '#2d3f55' }}>@</span>
      <span style={{ color: accent }}>hemant</span>
      <span style={{ color: '#2d3f55' }}>:~$</span>
    </span>
  );
}

function ProcessingDots({ accent }: { accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', gap: '0.3rem', padding: '0.2rem 0', alignItems: 'center' }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: '0.35rem', height: '0.35rem', borderRadius: '50%', background: accent, display: 'block' }}
        />
      ))}
    </motion.div>
  );
}

function OutputLine({
  line, index, accent, slow, lineId, copiedId, onCopy,
}: {
  line: Line;
  index: number;
  accent: string;
  slow?: boolean;
  lineId: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const color = resolveColor(line.color, accent);
  const isCopied = copiedId === lineId;
  const delay = slow ? index * 0.09 : index * 0.025;

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains-mono), monospace',
    fontSize: '0.78rem',
    lineHeight: 1.65,
    color: isCopied ? accent : color,
    display: 'block',
    whiteSpace: 'pre',
    minHeight: '1.1em',
    cursor: line.text.trim() ? 'copy' : 'default',
    transition: 'color 0.2s, background 0.2s',
    borderRadius: '3px',
    padding: '0 2px',
  };

  const handleClick = () => line.text.trim() && onCopy(line.text, lineId);

  const hoverIn = (el: HTMLElement) => { if (line.text.trim() && !line.href) el.style.background = 'rgba(255,255,255,0.04)'; };
  const hoverOut = (el: HTMLElement) => { el.style.background = 'transparent'; };

  if (line.href) {
    return (
      <motion.a
        href={line.href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, delay }}
        style={{ ...base, textDecoration: 'none', borderBottom: `1px solid ${color}40`, cursor: 'pointer' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accent; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = color; }}
      >
        {line.text || '\u00A0'}
      </motion.a>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, x: slow ? -8 : -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: slow ? 0.25 : 0.18, delay }}
      style={base}
      onClick={handleClick}
      onMouseEnter={(e) => hoverIn(e.currentTarget as HTMLElement)}
      onMouseLeave={(e) => hoverOut(e.currentTarget as HTMLElement)}
      title={line.text.trim() ? 'Click to copy' : undefined}
    >
      {line.text || '\u00A0'}
    </motion.span>
  );
}
