'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { event } from 'nextjs-google-analytics';
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

// ── virtual filesystem ────────────────────────────────────────────────────────

const HOME = '/home/visitor';

interface FSFile { type: 'file'; content: Line[]; hidden?: boolean }
interface FSDir  { type: 'dir';  hidden?: boolean }
type FSNode = FSFile | FSDir;

// Flat map of absolute path → node metadata
const FS_NODES: Record<string, FSNode> = {
  '/':                                    { type: 'dir' },
  '/home':                                { type: 'dir' },
  '/home/visitor':                        { type: 'dir' },
  '/home/visitor/.bashrc':               { type: 'file', hidden: true, content: [
    { text: '# ~/.bashrc — visitor config', color: 'dim' },
    { text: '' },
    { text: 'export PS1="visitor@hemant:~$ "', color: 'normal' },
    { text: 'export STACK="python:django:react:aws"', color: 'normal' },
    { text: 'export COFFEE_LIMIT=∞', color: 'normal' },
    { text: '' },
    { text: 'alias ll="ls -la"', color: 'normal' },
    { text: 'alias cls="clear"', color: 'normal' },
    { text: 'alias hire="sudo hire-me"', color: 'normal' },
    { text: '' },
    { text: '# note: impostor syndrome disabled in this shell session', color: 'dim' },
  ]},
  '/home/visitor/.gitconfig':            { type: 'file', hidden: true, content: [
    { text: '[user]', color: 'accent' },
    { text: `\tname  = ${FULL_NAME}`, color: 'normal' },
    { text: `\temail = ${EMAIL}`, color: 'normal' },
    { text: '' },
    { text: '[core]', color: 'accent' },
    { text: '\teditor = vim', color: 'normal' },
    { text: '\tautocrlf = input', color: 'normal' },
    { text: '' },
    { text: '[alias]', color: 'accent' },
    { text: '\tfix = commit -m "fix"', color: 'normal' },
    { text: '\toops = commit --amend --no-edit', color: 'normal' },
    { text: '\tplease = push --force-with-lease', color: 'normal' },
  ]},
  '/home/visitor/.ssh':                  { type: 'dir', hidden: true },
  '/home/visitor/.ssh/known_hosts':      { type: 'file', hidden: true, content: [
    { text: '# This file would contain real SSH host fingerprints.', color: 'dim' },
    { text: "# It doesn't. You're in a portfolio terminal.", color: 'dim' },
    { text: '' },
    { text: 'github.com ssh-ed25519 AAAAC3Nza...(truncated)', color: 'muted' },
    { text: 'dimagi.com ssh-rsa AAAAB3Nza...(classified)', color: 'muted' },
  ]},
  '/home/visitor/about.txt':             { type: 'file', content: [
    { text: FULL_NAME, color: 'accent' },
    { text: 'Software Engineer · 4+ years', color: 'normal' },
    { text: '' },
    { text: 'Spent 4 years closing the gap between', color: 'muted' },
    { text: '"works on my machine" and "works for 10,000 users."', color: 'accent' },
    { text: '' },
    { text: 'I like systems that are boring to operate.', color: 'dim' },
    { text: 'Boring means nothing is on fire.', color: 'dim' },
  ]},
  '/home/visitor/skills.txt':            { type: 'file', content: [
    { text: 'Backend    Python · Django · Java · Spring Boot', color: 'normal' },
    { text: 'Frontend   React · Angular · TypeScript · Tailwind', color: 'normal' },
    { text: 'Infra      AWS · Docker · PostgreSQL · MongoDB', color: 'normal' },
    { text: 'Tools      Git · REST APIs · Hibernate · Node.js', color: 'normal' },
  ]},
  '/home/visitor/contact.txt':           { type: 'file', content: [
    { text: `Email     ${EMAIL}`,                         color: 'normal', href: MAILTO },
    { text: `GitHub    github.com/${GITHUB_USERNAME}`,    color: 'normal', href: GITHUB_URL },
    { text: `LinkedIn  linkedin.com/in/${LINKEDIN_HANDLE}`, color: 'normal', href: LINKEDIN_URL },
    { text: `Stack     ${SO_URL.replace('https://', '')}`, color: 'normal', href: SO_URL },
  ]},
  '/home/visitor/resume.pdf':            { type: 'file', content: [
    { text: 'Binary file — open with:', color: 'dim' },
    { text: `  View   ${RESUME_VIEW_URL.replace('https://', '')}`, color: 'blue', href: RESUME_VIEW_URL },
    { text: `  PDF    ${RESUME_PDF_URL.replace('https://', '')}`, color: 'blue', href: RESUME_PDF_URL },
  ]},
  '/home/visitor/experience':            { type: 'dir' },
  '/home/visitor/experience/dimagi.txt': { type: 'file', content: [
    { text: `${DIMAGI.name}`, color: 'accent' },
    { text: `${DIMAGI.period} · ${DIMAGI.location}`, color: 'muted' },
    { text: 'Role: Software Engineer', color: 'normal' },
    { text: '' },
    { text: '  ▸ Maintained systems serving NGOs across 130+ countries', color: 'normal' },
    { text: '  ▸ Containerised Django workloads with Docker on AWS', color: 'normal' },
    { text: '  ▸ Shipped production features across a decade-old codebase', color: 'normal' },
    { text: '  ▸ Owned backend features end-to-end — design, code, deploy', color: 'normal' },
    { text: '' },
    { text: '  Stack: Python · Django · Docker · AWS · PostgreSQL', color: 'dim' },
  ]},
  '/home/visitor/experience/xcaliber.txt': { type: 'file', content: [
    { text: `${XCALIBER.name}`, color: 'accent' },
    { text: `${XCALIBER.period} · ${XCALIBER.location}`, color: 'muted' },
    { text: 'Role: Software Engineer', color: 'normal' },
    { text: '' },
    { text: '  ▸ Delivered Spring Boot REST APIs for enterprise clients', color: 'normal' },
    { text: '  ▸ Built Angular frontends consuming complex data models', color: 'normal' },
    { text: '  ▸ Integrated Amazon S3 for scalable file storage', color: 'normal' },
    { text: '  ▸ Full-stack across Java + TypeScript every day', color: 'normal' },
    { text: '' },
    { text: '  Stack: Spring Boot · Angular · Hibernate · Amazon S3', color: 'dim' },
  ]},
  '/home/visitor/projects':               { type: 'dir' },
  '/home/visitor/projects/ecommerce.txt': { type: 'file', content: [
    { text: PROJECT_ECOMMERCE.title, color: 'accent' },
    { text: 'Spring Boot + Angular + PostgreSQL', color: 'muted' },
    { text: '' },
    { text: '  Tried:   Custom auth with refresh token rotation. Very elegant.', color: 'normal' },
    { text: '  Broke:   Race condition on concurrent token refresh. Staging only.', color: 'red' },
    { text: '  Learned: Boring code is good code. Shipped standard JWT.', color: 'green' },
    { text: '' },
    { text: `  ↗ ${PROJECT_ECOMMERCE.githubUrl.replace('https://', '')}`, color: 'blue', href: PROJECT_ECOMMERCE.githubUrl },
  ]},
  '/home/visitor/projects/estore.txt':    { type: 'file', content: [
    { text: PROJECT_ESTORE.title, color: 'accent' },
    { text: 'MERN stack — MongoDB, Express, React, Node', color: 'muted' },
    { text: '' },
    { text: '  Tried:   MongoDB schemaless for "flexibility."', color: 'normal' },
    { text: '  Broke:   Querying nested arrays became an aggregation nightmare.', color: 'red' },
    { text: '  Learned: Design documents for how you read, not how you write.', color: 'green' },
    { text: '' },
    { text: `  ↗ ${PROJECT_ESTORE.githubUrl.replace('https://', '')}`, color: 'blue', href: PROJECT_ESTORE.githubUrl },
  ]},
  '/home/visitor/projects/bookstore.txt': { type: 'file', content: [
    { text: PROJECT_BOOKSTORE.title, color: 'accent' },
    { text: 'Angular + Google Books API', color: 'muted' },
    { text: '' },
    { text: '  Tried:   Infinite scroll, offline caching, custom debounce hook.', color: 'normal' },
    { text: '  Broke:   Nothing. Spent 3 days on things no user would notice.', color: 'orange' },
    { text: '  Learned: Sometimes a simple input + button is the product.', color: 'green' },
    { text: '' },
    { text: `  ↗ ${PROJECT_BOOKSTORE.demoUrl.replace('https://', '')}  [live]`, color: 'blue', href: PROJECT_BOOKSTORE.demoUrl },
  ]},
  '/home/visitor/.mistakes':              { type: 'dir', hidden: true },
  '/home/visitor/.mistakes/production.log': { type: 'file', hidden: true, content: [
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
  ]},
  '/etc':                 { type: 'dir' },
  '/etc/motivation':      { type: 'file', content: [
    { text: 'Build things that matter.', color: 'accent' },
    { text: 'Ship when ready, not when perfect.', color: 'normal' },
    { text: 'Read the error message.', color: 'muted' },
    { text: 'Then read it again.', color: 'dim' },
  ]},
  '/etc/passwd':          { type: 'file', content: [
    { text: 'root:x:0:0:root:/root:/bin/bash', color: 'dim' },
    { text: `visitor:x:1000:1000:Portfolio Visitor:/home/visitor:/bin/zsh`, color: 'normal' },
    { text: 'recruiter:x:1001:1001:Potential Employer:/dev/null:/bin/sh', color: 'muted' },
    { text: 'developer:x:1002:1002:Fellow Engineer:/home/visitor:/bin/zsh', color: 'muted' },
  ]},
  '/etc/profile':         { type: 'file', content: [
    { text: '# /etc/profile — system-wide shell config', color: 'dim' },
    { text: '' },
    { text: 'export LANG=en_US.UTF-8', color: 'normal' },
    { text: 'export PATH=/usr/local/bin:/usr/bin:/bin', color: 'normal' },
    { text: 'export PORTFOLIO_VERSION=2.0.0', color: 'accent' },
    { text: '' },
    { text: '# welcome message', color: 'dim' },
    { text: 'echo "Welcome to hemant@portfolio"', color: 'normal' },
  ]},
  '/var':                 { type: 'dir' },
  '/var/log':             { type: 'dir' },
  '/var/log/career.log':  { type: 'file', content: [
    { text: '2021-12-01 INFO  Career started at Xcaliber Infotech', color: 'green' },
    { text: '2021-12-15 INFO  First Spring Boot API deployed', color: 'normal' },
    { text: '2022-01-10 WARN  Encountered first LazyInitializationException', color: 'orange' },
    { text: '2022-01-11 INFO  Finally understood @Transactional', color: 'green' },
    { text: '2022-06-18 ERROR See ~/.mistakes/production.log', color: 'red' },
    { text: '2023-03-12 ERROR See ~/.mistakes/production.log', color: 'red' },
    { text: '2023-12-01 INFO  Joined Dimagi Inc.', color: 'green' },
    { text: '2023-12-05 INFO  First encounter with CommCare codebase', color: 'normal' },
    { text: '2023-12-05 WARN  Codebase spans a decade. Humbling.', color: 'orange' },
    { text: '2024-02-21 ERROR See ~/.mistakes/production.log', color: 'red' },
    { text: '2026-01-16 ERROR See ~/.mistakes/production.log', color: 'red' },
    { text: '2026-03-15 INFO  Still here. Still learning. Still building.', color: 'green' },
  ]},
};

// Children of each directory (controls what ls shows)
const FS_CHILDREN: Record<string, string[]> = {
  '/':                     ['home', 'etc', 'var'],
  '/home':                 ['visitor'],
  '/home/visitor':         ['about.txt', 'skills.txt', 'contact.txt', 'resume.pdf', 'experience', 'projects', '.bashrc', '.gitconfig', '.ssh', '.mistakes'],
  '/home/visitor/.ssh':    ['known_hosts'],
  '/home/visitor/experience': ['dimagi.txt', 'xcaliber.txt'],
  '/home/visitor/projects':   ['ecommerce.txt', 'estore.txt', 'bookstore.txt'],
  '/home/visitor/.mistakes':  ['production.log'],
  '/etc':                  ['motivation', 'passwd', 'profile'],
  '/var':                  ['log'],
  '/var/log':              ['career.log'],
};

// ── fs helpers ────────────────────────────────────────────────────────────────

function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') { out.pop(); continue; }
    out.push(p);
  }
  return '/' + out.join('/');
}

function resolvePath(cwd: string, target: string): string {
  if (!target || target === '~') return HOME;
  if (target.startsWith('~/')) return normalizePath(HOME + '/' + target.slice(2));
  if (target.startsWith('/'))  return normalizePath(target);
  return normalizePath(cwd + '/' + target);
}

function formatCwd(cwd: string): string {
  if (cwd === HOME) return '~';
  if (cwd.startsWith(HOME + '/')) return '~' + cwd.slice(HOME.length);
  return cwd;
}

function getNode(path: string): FSNode | undefined {
  return FS_NODES[path];
}

function lsDir(path: string, showAll: boolean, long: boolean): Line[] {
  const children = FS_CHILDREN[path];
  if (!children) return [{ text: `ls: cannot access '${path}': No such file or directory`, color: 'red' }];

  const visible = children.filter(c => showAll || !c.startsWith('.'));
  if (visible.length === 0) return [{ text: '(empty)', color: 'dim' }];

  if (long) {
    const lines: Line[] = [{ text: `total ${visible.length * 4}`, color: 'dim' }];
    for (const child of (showAll ? children : visible)) {
      const childPath = path === '/' ? `/${child}` : `${path}/${child}`;
      const node = FS_NODES[childPath];
      if (!node) continue;
      const isDir    = node.type === 'dir';
      const isHidden = child.startsWith('.');
      lines.push({
        text: `${isDir ? 'drwxr-xr-x' : '-rw-r--r--'}  ${child}${isDir ? '/' : ''}`,
        color: isHidden ? 'red' : isDir ? 'accent' : 'normal',
      });
    }
    if (!showAll && children.some(c => c.startsWith('.'))) {
      lines.push({ text: '' });
      lines.push({ text: "// use 'ls -a' to show hidden files", color: 'dim' });
    }
    return lines;
  }

  // Short format: build name list then display as columns
  const names = visible.map(c => {
    const childPath = path === '/' ? `/${c}` : `${path}/${c}`;
    const node = FS_NODES[childPath];
    return node?.type === 'dir' ? `${c}/` : c;
  });
  const result: Line[] = [{ text: names.join('   '), color: 'accent' }];
  if (!showAll && children.some(c => c.startsWith('.'))) {
    result.push({ text: '' });
    result.push({ text: "// use 'ls -a' or 'ls -la' to show hidden files", color: 'dim' });
  }
  return result;
}

// ── other constants ───────────────────────────────────────────────────────────

const WELCOME: Line[] = [
  { text: '╔════════════════════════════════════════════════════╗', color: 'dim' },
  { text: '║   hemant@portfolio  ·  v2.0.0  ·  interactive cli  ║', color: 'accent' },
  { text: '╚════════════════════════════════════════════════════╝', color: 'dim' },
  { text: '' },
  { text: "  Type 'help' to see all commands.", color: 'muted' },
  { text: '  Some files are hidden. Explore with ls.', color: 'dim' },
  { text: '' },
];

const ENV_VARS: Line[] = [
  { text: `USER=${GITHUB_USERNAME}`, color: 'normal' },
  { text: `HOME=${HOME}`, color: 'normal' },
  { text: 'SHELL=/bin/zsh', color: 'normal' },
  { text: 'STACK=python:django:react:aws', color: 'accent' },
  { text: 'COFFEE_CONSUMED=∞', color: 'normal' },
  { text: 'BUGS_FIXED=many', color: 'green' },
  { text: 'BUGS_INTRODUCED=some', color: 'orange' },
  { text: 'DEADLINE=soon™', color: 'red' },
  { text: 'IMPOSTOR_SYNDROME=disabled', color: 'green' },
];

const MAN_PAGES: Record<string, Line[]> = {
  cd:     [{ text: 'cd <dir> — change directory. supports ~, .., absolute paths', color: 'normal' }],
  ls:     [{ text: 'ls [-la] [-a] [path] — list directory contents', color: 'normal' }, { text: '  -la  long format + hidden  |  -a  all including hidden', color: 'dim' }],
  cat:    [{ text: 'cat <file> — print file contents. works with relative & absolute paths', color: 'normal' }],
  pwd:    [{ text: 'pwd — print working directory', color: 'normal' }],
  mkdir:  [{ text: 'mkdir <dir> — create directory (session only)', color: 'normal' }],
  touch:  [{ text: 'touch <file> — create empty file (session only)', color: 'normal' }],
  grep:   [{ text: 'command | grep <pattern> — filter output lines by pattern', color: 'normal' }, { text: 'example: ls -la | grep mistakes', color: 'dim' }],
  git:    [{ text: 'git log / git blame / git status', color: 'normal' }],
  mode:   [{ text: 'mode — toggle recruiter ↔ developer view', color: 'normal' }],
  whoami: [{ text: `whoami — ${FULL_NAME}, Software Engineer`, color: 'normal' }],
};

const SLOW_CMDS = new Set(['neofetch', 'git log', 'ping google.com', 'npm install talent']);

const ALL_CMDS = [
  'help', 'whoami', 'about', 'skills', 'experience', 'projects',
  'contact', 'resume', 'mode', 'clear', 'history', 'pwd', 'ls',
  'ls -la', 'ls -a', 'll', 'cd', 'cd ~', 'cat', 'mkdir', 'touch',
  'rm', 'cp', 'mv', 'env', 'alias', 'uname', 'neofetch', 'vim',
  'nano', 'exit', 'date', 'echo', 'grep', 'man', 'open',
  'git log', 'git blame', 'git status', 'ssh hemant',
  'sudo hire-me', 'rm -rf bugs', 'curl ifconfig.me',
  'npm install talent', 'ping google.com', 'echo $USER',
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
  const other = viewerType === 'recruiter' ? 'developer' : 'recruiter';
  return [
    { text: '┌── Commands ─────────────────────────────────────────────┐', color: 'dim' },
    { text: '│  Filesystem                                              │', color: 'dim' },
    { text: '│  ls [-la|-a] [path]   list directory contents           │', color: 'normal' },
    { text: '│  cd <path>            change directory                  │', color: 'normal' },
    { text: '│  pwd                  print working directory           │', color: 'normal' },
    { text: '│  cat <file>           print file contents               │', color: 'normal' },
    { text: '│  mkdir / touch / rm   create or remove                  │', color: 'normal' },
    { text: '│                                                          │', color: 'dim' },
    { text: '│  Portfolio                                               │', color: 'dim' },
    { text: '│  whoami   about   skills   experience   projects        │', color: 'normal' },
    { text: '│  contact  resume  history  env  man <cmd>               │', color: 'normal' },
    { text: `│  mode     switch to ${other} view                      │`, color: 'normal' },
    { text: '│  clear    reset terminal                                 │', color: 'normal' },
    { text: '│                                                          │', color: 'dim' },
    { text: '│  Keyboard                                                │', color: 'dim' },
    { text: '│  Tab    complete   Ctrl+R  search history               │', color: 'dim' },
    { text: '│  ↑ ↓    history    Ctrl+L  clear                        │', color: 'dim' },
    { text: '│  Ctrl+A/E start/end  Ctrl+W del word  Ctrl+U clear line │', color: 'dim' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'dim' },
    { text: '' },
    { text: '  Try: ls → cd experience → cat dimagi.txt', color: 'dim' },
    { text: '  Click any output line to copy it.', color: 'dim' },
  ];
}

function getCmdOutput(cmd: string, viewerType: string, cwd: string): Line[] | null {
  const lower = cmd.trim().toLowerCase();
  if (lower === 'help') return getHelp(viewerType);
  // ls / ls -la / ls -a with optional path argument
  const lsMatch = lower.match(/^ls(\s+-la|-a|-l)?\s*(.*)$/);
  if (lsMatch) {
    const flags = (lsMatch[1] || '').trim();
    const arg   = (lsMatch[2] || '').trim();
    const target = arg ? resolvePath(cwd, arg) : cwd;
    const node = getNode(target);
    if (!node) return [{ text: `ls: cannot access '${arg || '.'}': No such file or directory`, color: 'red' }];
    if (node.type === 'file') return [{ text: `${arg || '.'}`, color: 'normal' }];
    return lsDir(target, flags.includes('a'), flags.includes('l'));
  }
  return null; // not handled here
}

function findSimilar(input: string, commands: string[]): string | null {
  if (input.length < 2) return null;
  const prefix = input.slice(0, Math.min(3, input.length)).toLowerCase();
  return commands.find(c => c !== input && (c.startsWith(prefix) || c.includes(prefix))) ?? null;
}

function findInHistory(history: string[], query: string): string {
  if (!query) return '';
  return history.find(c => c.toLowerCase().includes(query.toLowerCase())) ?? '';
}

// ── component ─────────────────────────────────────────────────────────────────

export default function CLITerminal() {
  const { viewerType, accent, toggleViewerType } = useViewer();

  const [entries, setEntries]         = useState<HistoryEntry[]>([{ id: 0, cmd: null, output: WELCOME }]);
  const [input, setInput]             = useState('');
  const [cmdHistory, setCmdHistory]   = useState<string[]>([]);
  const [cmdIdx, setCmdIdx]           = useState(-1);
  const [isFocused, setIsFocused]     = useState(false);
  const [copiedId, setCopiedId]       = useState<string | null>(null);
  const [cwd, setCwd]                 = useState(HOME);

  // mutable fs overlay (mkdir/touch create nodes here)
  const [userNodes, setUserNodes]     = useState<Record<string, FSNode>>({});
  const [userChildren, setUserChildren] = useState<Record<string, string[]>>({});

  // Ctrl+R
  const [searchMode, setSearchMode]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const idRef    = useRef(1);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries]);

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

  // Resolve a node from both static and user-created overlay
  const resolveNode = useCallback((path: string): FSNode | undefined => {
    return userNodes[path] ?? FS_NODES[path];
  }, [userNodes]);

  const resolveChildren = useCallback((path: string): string[] | undefined => {
    const userKids = userChildren[path];
    const staticKids = FS_CHILDREN[path];
    if (userKids && staticKids) return [...staticKids, ...userKids];
    return userKids ?? staticKids;
  }, [userChildren]);

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

    // Track command usage — sanitize echo to avoid logging user-typed content
    event('terminal_command', {
      category: 'Terminal',
      label: lower.startsWith('echo ') ? 'echo' : lower,
      value: 1,
    });

    // ── pipe ─────────────────────────────────────────────────────────────────
    if (cmd.includes('|')) {
      const parts = cmd.split('|').map(s => s.trim());
      let result: Line[] = getCmdOutput(parts[0], viewerType, cwd) ?? [];
      if (!result.length) {
        const n = resolveNode(resolvePath(cwd, parts[0].replace('cat ', '').trim()));
        if (n?.type === 'file') result = n.content;
      }
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i].trim();
        if (part.startsWith('grep ')) {
          const pattern = part.slice(5).trim().toLowerCase();
          const filtered = result.filter(l => l.text.toLowerCase().includes(pattern));
          result = filtered.length ? filtered : [{ text: `grep: no matches for '${pattern}'`, color: 'red' }];
        }
      }
      pushEntry(cmd, result);
      return;
    }

    // ── clear ─────────────────────────────────────────────────────────────────
    if (lower === 'clear' || lower === 'cls') {
      setEntries([{ id: idRef.current++, cmd: null, output: WELCOME }]);
      return;
    }

    // ── pwd ───────────────────────────────────────────────────────────────────
    if (lower === 'pwd') {
      pushEntry(cmd, [{ text: cwd, color: 'normal' }]);
      return;
    }

    // ── cd ────────────────────────────────────────────────────────────────────
    if (lower === 'cd' || lower === 'cd ~' || lower === 'cd ~/') {
      setCwd(HOME);
      pushEntry(cmd, []);
      return;
    }
    if (lower.startsWith('cd ')) {
      const arg = cmd.slice(3).trim();
      const target = resolvePath(cwd, arg);
      const node = resolveNode(target);
      if (!node) {
        pushEntry(cmd, [{ text: `cd: no such file or directory: ${arg}`, color: 'red' }]);
        return;
      }
      if (node.type === 'file') {
        pushEntry(cmd, [{ text: `cd: not a directory: ${arg}`, color: 'red' }]);
        return;
      }
      setCwd(target);
      pushEntry(cmd, []);
      return;
    }

    // ── ls (dynamic, filesystem-aware) ────────────────────────────────────────
    {
      const lsMatch = lower.match(/^(ls|ll)(?:\s+(-la|-al|-a|-l))?\s*(.*)$/);
      if (lsMatch) {
        const isLL   = lsMatch[1] === 'll';
        const flags  = isLL ? '-la' : (lsMatch[2] || '').trim();
        const arg    = (lsMatch[3] || '').trim();
        const target = arg ? resolvePath(cwd, arg) : cwd;
        const node   = resolveNode(target);

        if (!node) {
          pushEntry(cmd, [{ text: `ls: cannot access '${arg}': No such file or directory`, color: 'red' }]);
          return;
        }
        if (node.type === 'file') {
          pushEntry(cmd, [{ text: arg || '.', color: 'normal' }]);
          return;
        }

        const children = resolveChildren(target) ?? [];
        const showAll  = flags.includes('a');
        const long     = flags.includes('l');
        const visible  = children.filter(c => showAll || !c.startsWith('.'));

        if (long) {
          const lines: Line[] = [{ text: `total ${visible.length * 4}`, color: 'dim' }];
          for (const child of (showAll ? children : visible)) {
            const childPath = target === '/' ? `/${child}` : `${target}/${child}`;
            const cNode = resolveNode(childPath);
            if (!cNode) continue;
            const isDir = cNode.type === 'dir';
            lines.push({
              text: `${isDir ? 'drwxr-xr-x' : '-rw-r--r--'}  ${child}${isDir ? '/' : ''}`,
              color: child.startsWith('.') ? 'red' : isDir ? 'accent' : 'normal',
            });
          }
          if (!showAll && children.some(c => c.startsWith('.'))) {
            lines.push({ text: '' });
            lines.push({ text: "// use 'ls -a' to show hidden files", color: 'dim' });
          }
          pushEntry(cmd, lines);
        } else {
          const names = visible.map(c => {
            const childPath = target === '/' ? `/${c}` : `${target}/${c}`;
            const cNode = resolveNode(childPath);
            return cNode?.type === 'dir' ? `${c}/` : c;
          });
          const result: Line[] = [{ text: names.join('   ') || '(empty)', color: 'accent' }];
          if (!showAll && children.some(c => c.startsWith('.'))) {
            result.push({ text: '' });
            result.push({ text: "// use 'ls -a' to show hidden files", color: 'dim' });
          }
          pushEntry(cmd, result);
        }
        return;
      }
    }

    // ── cat (filesystem-aware) ────────────────────────────────────────────────
    if (lower.startsWith('cat ')) {
      const arg  = cmd.slice(4).trim();
      const path = resolvePath(cwd, arg);
      const node = resolveNode(path);

      if (!node) {
        pushEntry(cmd, [{ text: `cat: ${arg}: No such file or directory`, color: 'red' }]);
        return;
      }
      if (node.type === 'dir') {
        pushEntry(cmd, [{ text: `cat: ${arg}: Is a directory`, color: 'red' }]);
        return;
      }

      const isTypewriter = path.includes('production.log');
      const isSlowFile   = path.includes('production.log') || path.includes('career.log');

      if (isSlowFile) {
        const entryId = idRef.current++;
        setEntries(prev => [...prev, { id: entryId, cmd, output: [], processing: true }]);
        setTimeout(() => {
          setEntries(prev => prev.map(e =>
            e.id === entryId
              ? { ...e, output: node.content, processing: false, typewriter: isTypewriter }
              : e
          ));
        }, 700 + Math.random() * 400);
      } else {
        pushEntry(cmd, node.content);
      }
      return;
    }

    // ── mkdir ─────────────────────────────────────────────────────────────────
    if (lower.startsWith('mkdir ')) {
      const arg  = cmd.slice(6).trim();
      const path = resolvePath(cwd, arg);
      if (resolveNode(path)) {
        pushEntry(cmd, [{ text: `mkdir: ${arg}: File exists`, color: 'red' }]);
        return;
      }
      const parent = path.slice(0, path.lastIndexOf('/')) || '/';
      const name   = path.slice(path.lastIndexOf('/') + 1);
      setUserNodes(prev => ({ ...prev, [path]: { type: 'dir' } }));
      setUserChildren(prev => ({
        ...prev,
        [parent]: [...(resolveChildren(parent) ?? []), name],
      }));
      pushEntry(cmd, [{ text: `created directory '${arg}'`, color: 'green' }]);
      return;
    }

    // ── touch ─────────────────────────────────────────────────────────────────
    if (lower.startsWith('touch ')) {
      const arg  = cmd.slice(6).trim();
      const path = resolvePath(cwd, arg);
      if (resolveNode(path)) {
        pushEntry(cmd, []); // touch existing file: no output, just updates mtime
        return;
      }
      const parent = path.slice(0, path.lastIndexOf('/')) || '/';
      const name   = path.slice(path.lastIndexOf('/') + 1);
      setUserNodes(prev => ({ ...prev, [path]: { type: 'file', content: [] } }));
      setUserChildren(prev => ({
        ...prev,
        [parent]: [...(resolveChildren(parent) ?? []), name],
      }));
      pushEntry(cmd, []);
      return;
    }

    // ── rm ────────────────────────────────────────────────────────────────────
    if (lower.startsWith('rm')) {
      const arg = cmd.replace(/^rm\s+-?rf?\s*/i, '').trim() || cmd.slice(2).trim();
      if (arg === 'bugs' || lower === 'rm -rf bugs') {
        pushEntry(cmd, [{ text: "rm: cannot remove 'bugs': Permission denied", color: 'red' }, { text: '(they always come back anyway)', color: 'dim' }]);
        return;
      }
      if (arg === '.' || arg === '/' || lower.includes('rm -rf .') || lower.includes('rm -rf /')) {
        pushEntry(cmd, [{ text: "rm: refusing to remove '.' or '/' — are you ok?", color: 'red' }, { text: '(nice try.)', color: 'dim' }]);
        return;
      }
      // User-created files can be removed
      const path = resolvePath(cwd, arg);
      if (userNodes[path]) {
        const parent = path.slice(0, path.lastIndexOf('/')) || '/';
        const name   = path.slice(path.lastIndexOf('/') + 1);
        setUserNodes(prev => { const n = { ...prev }; delete n[path]; return n; });
        setUserChildren(prev => ({ ...prev, [parent]: (prev[parent] ?? []).filter(c => c !== name) }));
        pushEntry(cmd, []);
        return;
      }
      if (FS_NODES[path]) {
        pushEntry(cmd, [{ text: `rm: cannot remove '${arg}': Read-only file system`, color: 'red' }]);
        return;
      }
      pushEntry(cmd, [{ text: `rm: ${arg}: No such file or directory`, color: 'red' }]);
      return;
    }

    // ── cp / mv ───────────────────────────────────────────────────────────────
    if (lower.startsWith('cp ') || lower.startsWith('mv ')) {
      const op = lower.startsWith('cp') ? 'cp' : 'mv';
      pushEntry(cmd, [{ text: `${op}: operation supported but files don't persist across sessions.`, color: 'muted' }]);
      return;
    }

    // ── open ──────────────────────────────────────────────────────────────────
    if (lower.startsWith('open ')) {
      const arg  = cmd.slice(5).trim();
      const path = resolvePath(cwd, arg);
      const node = resolveNode(path);
      if (!node) { pushEntry(cmd, [{ text: `open: ${arg}: No such file or directory`, color: 'red' }]); return; }
      if (node.type === 'dir') { pushEntry(cmd, [{ text: `Opened directory ${arg}`, color: 'dim' }]); return; }
      pushEntry(cmd, node.content);
      return;
    }

    // ── help ──────────────────────────────────────────────────────────────────
    if (lower === 'help') { pushEntry(cmd, getHelp(viewerType)); return; }

    // ── mode ──────────────────────────────────────────────────────────────────
    if (lower === 'mode') {
      const next = viewerType === 'recruiter' ? 'developer' : 'recruiter';
      toggleViewerType();
      pushEntry(cmd, [{ text: `✓ Switched to ${next} view.`, color: 'green' }, { text: '  Scroll up — the whole site just changed.', color: 'dim' }]);
      return;
    }

    // ── date ─────────────────────────────────────────────────────────────────
    if (lower === 'date') { pushEntry(cmd, [{ text: new Date().toLocaleString(), color: 'normal' }]); return; }

    // ── echo ──────────────────────────────────────────────────────────────────
    if (lower.startsWith('echo ') && lower !== 'echo $user') {
      pushEntry(cmd, [{ text: cmd.slice(5), color: 'normal' }]);
      return;
    }

    // ── history ───────────────────────────────────────────────────────────────
    if (lower === 'history') {
      pushEntry(cmd, cmdHistory.length
        ? cmdHistory.slice(0, 25).map((c, i) => ({ text: `  ${String(cmdHistory.length - i).padStart(3)}  ${c}`, color: 'normal' as LineColor }))
        : [{ text: 'No commands in history yet.', color: 'dim' }]);
      return;
    }

    // ── man ───────────────────────────────────────────────────────────────────
    if (lower.startsWith('man ')) {
      const target = lower.slice(4).trim();
      pushEntry(cmd, MAN_PAGES[target] ?? [{ text: `No manual entry for ${target}`, color: 'red' }, { text: '(try: man ls, man cd, man cat, man grep)', color: 'dim' }]);
      return;
    }

    // ── env / alias / uname ───────────────────────────────────────────────────
    if (lower === 'env')   { pushEntry(cmd, ENV_VARS); return; }
    if (lower === 'uname') { pushEntry(cmd, [{ text: 'hemant-portfolio Darwin 24.0.0 arm64', color: 'normal' }]); return; }
    if (lower === 'alias') { pushEntry(cmd, [{ text: "alias ll='ls -la'", color: 'normal' }, { text: "alias cls='clear'", color: 'normal' }, { text: "alias hire='sudo hire-me'", color: 'normal' }]); return; }

    // ── whoami / about / skills / experience / projects / contact / resume ────
    if (lower === 'whoami')     { pushEntry(cmd, (FS_NODES[`${HOME}/about.txt`] as FSFile).content); return; }
    if (lower === 'about')      { pushEntry(cmd, (FS_NODES[`${HOME}/about.txt`] as FSFile).content); return; }
    if (lower === 'skills')     { pushEntry(cmd, (FS_NODES[`${HOME}/skills.txt`] as FSFile).content); return; }
    if (lower === 'contact')    { pushEntry(cmd, (FS_NODES[`${HOME}/contact.txt`] as FSFile).content); return; }
    if (lower === 'resume')     { pushEntry(cmd, (FS_NODES[`${HOME}/resume.pdf`] as FSFile).content); return; }
    if (lower === 'experience') { pushEntry(cmd, (FS_NODES[`${HOME}/experience`] as FSNode).type === 'dir' ? lsDir(`${HOME}/experience`, false, false) : []); return; }
    if (lower === 'projects')   { pushEntry(cmd, lsDir(`${HOME}/projects`, false, false)); return; }

    // ── git ───────────────────────────────────────────────────────────────────
    if (lower === 'git blame') { pushEntry(cmd, [{ text: "fatal: no repository found in '.'", color: 'red' }, { text: '' }, { text: "...though if you're looking for someone to blame,", color: 'muted' }, { text: "that's probably me. — Hemant", color: 'dim' }]); return; }
    if (lower === 'git status') { pushEntry(cmd, [{ text: 'On branch main', color: 'normal' }, { text: "Your branch is up to date with 'origin/main'.", color: 'green' }, { text: '' }, { text: 'Changes not staged for commit:', color: 'normal' }, { text: '  modified:   life/career.json', color: 'red' }, { text: '  modified:   skills/still-learning.md', color: 'red' }, { text: '' }, { text: 'no changes added to commit', color: 'muted' }]); return; }

    // ── slow commands ─────────────────────────────────────────────────────────
    if (SLOW_CMDS.has(lower)) {
      const entryId = idRef.current++;
      const outputs: Record<string, Line[]> = {
        'neofetch': [
          { text: `          ██████           visitor@${GITHUB_USERNAME}`, color: 'accent' },
          { text: '        ██      ██         ─────────────────────────', color: 'accent' },
          { text: `      ██  ████  ██         OS: Portfolio v2.0.0`, color: 'normal' },
          { text: `      ██  ████  ██         Shell: zsh`, color: 'normal' },
          { text: `        ██████             Stack: Python · Django · React`, color: 'normal' },
          { text: `      ██      ██           Theme: dark (obviously)`, color: 'normal' },
          { text: `    ████████████████       Memory: full of coffee`, color: 'normal' },
          { text: `                           Uptime: 4 years`, color: 'muted' },
          { text: `                           CWD: ${formatCwd(cwd)}`, color: 'dim' },
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
        'ping google.com': [
          { text: 'PING google.com: 56 data bytes', color: 'normal' },
          { text: '64 bytes from 142.250.80.46: icmp_seq=0 ttl=116 time=12.3 ms', color: 'muted' },
          { text: '64 bytes from 142.250.80.46: icmp_seq=1 ttl=116 time=11.8 ms', color: 'muted' },
          { text: '3 packets transmitted, 3 received, 0% packet loss', color: 'green' },
        ],
        'npm install talent': [
          { text: 'npm warn deprecated shortcuts@1.0.0', color: 'orange' },
          { text: '' },
          { text: 'added 1 package in 4 years', color: 'green' },
          { text: '1 package is looking for funding — run `npm fund`', color: 'dim' },
        ],
      };
      setEntries(prev => [...prev, { id: entryId, cmd, output: [], processing: true }]);
      setTimeout(() => {
        setEntries(prev => prev.map(e =>
          e.id === entryId ? { ...e, output: outputs[lower] ?? [], processing: false } : e
        ));
      }, 700 + Math.random() * 400);
      return;
    }

    // ── other easter eggs ─────────────────────────────────────────────────────
    if (lower === 'sudo hire-me')     { pushEntry(cmd, [{ text: '[sudo] password for visitor: ', color: 'normal' }, { text: 'sudo: 3 incorrect password attempts', color: 'red' }, { text: '' }, { text: `...but seriously. ${EMAIL}`, color: 'accent', href: MAILTO }]); return; }
    if (lower === 'ssh hemant')       { pushEntry(cmd, [{ text: 'ssh: connect to host hemant port 22: Connection refused', color: 'red' }, { text: `↗ ${EMAIL}`, color: 'blue', href: MAILTO }]); return; }
    if (lower === 'curl ifconfig.me') { pushEntry(cmd, [{ text: "you're visiting from somewhere on the internet.", color: 'normal' }]); return; }
    if (lower === 'vim' || lower === 'vi') { pushEntry(cmd, [{ text: '-- INSERT --', color: 'normal' }, { text: '' }, { text: 'just kidding. you are not in vim.', color: 'muted' }, { text: "(but if you were: :q to quit)", color: 'dim' }]); return; }
    if (lower === 'nano')             { pushEntry(cmd, [{ text: 'nano: command not found', color: 'red' }, { text: '(use vim. just kidding. use VS Code.)', color: 'dim' }]); return; }
    if (lower === 'exit')             { pushEntry(cmd, [{ text: 'logout', color: 'dim' }, { text: "(you can't leave. scroll up.)", color: 'accent' }]); return; }
    if (lower === 'echo $user')       { pushEntry(cmd, [{ text: 'visitor', color: 'normal' }]); return; }
    if (lower === 'grep' || (lower.startsWith('grep ') && !cmd.includes('|'))) { pushEntry(cmd, [{ text: 'usage: command | grep <pattern>', color: 'red' }, { text: 'example: ls -la | grep mistakes', color: 'dim' }]); return; }

    // ── did you mean ──────────────────────────────────────────────────────────
    const similar = findSimilar(lower, ALL_CMDS);
    const notFoundLines: Line[] = [
      { text: `zsh: command not found: ${cmd}`, color: 'red' },
      ...(similar ? [{ text: `Did you mean '${similar}'?`, color: 'dim' } as Line] : []),
      { text: "Type 'help' for available commands.", color: 'dim' },
    ];
    pushEntry(cmd, notFoundLines);
  }, [viewerType, toggleViewerType, pushEntry, cmdHistory, cwd, resolveNode, resolveChildren]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchMode) {
      if (e.key === 'Enter')    { const f = findInHistory(cmdHistory, searchQuery); setSearchMode(false); setSearchQuery(''); if (f) setInput(f); }
      else if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) { setSearchMode(false); setSearchQuery(''); }
      else if (e.key === 'Backspace')   { setSearchQuery(p => p.slice(0, -1)); }
      else if (e.key.length === 1 && !e.ctrlKey) { setSearchQuery(p => p + e.key); }
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      runCommand(input); setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Path-aware completion for commands that take a path argument
      const pathCmdMatch = input.match(/^(cd|cat|ls|open|rm|touch|mkdir)\s+(.*)$/i);
      if (pathCmdMatch) {
        const cmdPart    = pathCmdMatch[1];
        const pathPrefix = pathCmdMatch[2];
        const isCdCmd    = cmdPart.toLowerCase() === 'cd';
        const children   = resolveChildren(cwd) ?? [];
        const matches    = children.filter(name => {
          if (!name.toLowerCase().startsWith(pathPrefix.toLowerCase())) return false;
          if (isCdCmd) {
            const childPath = cwd === '/' ? `/${name}` : `${cwd}/${name}`;
            return resolveNode(childPath)?.type === 'dir';
          }
          return true;
        });
        if (matches.length === 1) {
          const childPath = cwd === '/' ? `/${matches[0]}` : `${cwd}/${matches[0]}`;
          const isDir = resolveNode(childPath)?.type === 'dir';
          setInput(`${cmdPart} ${matches[0]}${isDir && isCdCmd ? '' : ''}`);
        } else if (matches.length > 1) {
          pushEntry(input, [{ text: matches.join('   '), color: 'accent' }]);
        }
        return;
      }
      // Command completion
      const matches = ALL_CMDS.filter(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1) pushEntry(input, [{ text: matches.join('   '), color: 'accent' }]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(next); setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(cmdIdx - 1, -1);
      setCmdIdx(next); setInput(next === -1 ? '' : (cmdHistory[next] ?? ''));
    } else if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'c': e.preventDefault(); if (input) { pushEntry(input + '^C', []); setInput(''); } break;
        case 'l': e.preventDefault(); setEntries([{ id: idRef.current++, cmd: null, output: WELCOME }]); break;
        case 'a': e.preventDefault(); setTimeout(() => inputRef.current?.setSelectionRange(0, 0)); break;
        case 'e': e.preventDefault(); setTimeout(() => inputRef.current?.setSelectionRange(input.length, input.length)); break;
        case 'w': { e.preventDefault(); const t = input.trimEnd(); const i = t.lastIndexOf(' '); setInput(i === -1 ? '' : t.slice(0, i + 1)); break; }
        case 'u': e.preventDefault(); setInput(''); break;
        case 'r': e.preventDefault(); setSearchMode(true); setSearchQuery(''); break;
      }
    }
  };

  const searchResult = searchMode ? findInHistory(cmdHistory, searchQuery) : '';
  const displayCwd   = formatCwd(cwd);

  return (
    <section id="terminal" style={{ maxWidth: '72rem', margin: '0 auto', padding: 'clamp(2rem, 6vw, 4rem) 1.5rem 2rem', position: 'relative' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', width: '0.55rem', height: '0.55rem', borderRadius: '50%', background: accent, opacity: 0.35, animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: accent, display: 'block', position: 'relative' }} />
          </span>
          <h2 style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '1.6rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Terminal</h2>
          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--fg-4)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '999px', border: `1px solid ${accent}25`, background: `${accent}08` }}>
            interactive
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['`', 'focus'], ['Ctrl+R', 'search'], ['Ctrl+L', 'clear'], ['Tab', 'complete']].map(([k, d]) => (
            <span key={k} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6rem', color: 'var(--fg-6)' }}>
              <span style={{ color: `${accent}90` }}>{k}</span> {d}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        onClick={() => inputRef.current?.focus()}
        style={{ background: '#0b1120', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${isFocused ? `${accent}50` : 'rgba(255,255,255,0.12)'}`, boxShadow: isFocused ? `0 0 0 1px ${accent}20, 0 24px 60px rgba(0,0,0,0.6)` : '0 4px 6px rgba(0,0,0,0.3), 0 24px 60px rgba(0,0,0,0.5)', transition: 'border-color 0.25s, box-shadow 0.25s', cursor: 'text', fontFamily: 'var(--font-jetbrains-mono), monospace' }}
      >
        {/* Chrome */}
        <div style={{ background: '#141c2e', padding: '0.65rem 1rem', borderBottom: `1px solid ${isFocused ? `${accent}18` : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', gap: '0.5rem', userSelect: 'none', transition: 'border-color 0.25s' }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map(c => <span key={c} style={{ width: '0.55rem', height: '0.55rem', borderRadius: '50%', background: c, display: 'block', opacity: 0.8 }} />)}
          <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.68rem', color: '#334155', marginLeft: '0.4rem' }}>
            visitor@hemant — {displayCwd}
          </span>
          {isFocused && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: `${accent}60` }}>● active</span>}
        </div>

        {/* Body */}
        <div ref={bodyRef} style={{ height: 'clamp(360px, 55vh, 520px)', overflowY: 'auto', padding: '1rem 1.25rem 0.5rem', scrollbarWidth: 'thin', scrollbarColor: `${accent}25 transparent` }}>
          {entries.map(entry => (
            <div key={entry.id} style={{ marginBottom: '0.5rem' }}>
              {entry.cmd !== null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <Prompt accent={accent} cwd={displayCwd} />
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.82rem', color: '#e2e8f0' }}>{entry.cmd}</span>
                </div>
              )}
              {entry.processing && <ProcessingDots accent={accent} />}
              {!entry.processing && entry.output.map((line, li) => (
                <OutputLine key={li} line={line} index={li} accent={accent} slow={entry.typewriter} lineId={`${entry.id}-${li}`} copiedId={copiedId} onCopy={copyLine} />
              ))}
            </div>
          ))}

          {/* Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
            {searchMode ? (
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
                <Prompt accent={accent} cwd={displayCwd} />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
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
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', bottom: '3.5rem', right: '1.5rem', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.65rem', color: accent, background: `${accent}15`, border: `1px solid ${accent}30`, padding: '0.25rem 0.6rem', borderRadius: '6px', pointerEvents: 'none' }}
        >
          ✓ copied
        </motion.div>
      )}
    </section>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function Prompt({ accent, cwd }: { accent: string; cwd: string }) {
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', userSelect: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
      <span style={{ color: '#475569' }}>visitor</span>
      <span style={{ color: '#2d3f55' }}>@</span>
      <span style={{ color: accent }}>hemant</span>
      <span style={{ color: '#334155' }}>:</span>
      <span style={{ color: `${accent}cc` }}>{cwd}</span>
      <span style={{ color: '#2d3f55' }}>$</span>
    </span>
  );
}

function ProcessingDots({ accent }: { accent: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.3rem', padding: '0.2rem 0', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: '0.35rem', height: '0.35rem', borderRadius: '50%', background: accent, display: 'block' }} />
      ))}
    </motion.div>
  );
}

function OutputLine({ line, index, accent, slow, lineId, copiedId, onCopy }: {
  line: Line; index: number; accent: string; slow?: boolean;
  lineId: string; copiedId: string | null; onCopy: (text: string, id: string) => void;
}) {
  const color   = resolveColor(line.color, accent);
  const isCopied = copiedId === lineId;
  const delay   = slow ? index * 0.09 : index * 0.025;

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.78rem', lineHeight: 1.65,
    color: isCopied ? accent : color, display: 'block', whiteSpace: 'pre', minHeight: '1.1em',
    cursor: line.text.trim() ? 'copy' : 'default', transition: 'color 0.15s, background 0.15s',
    borderRadius: '3px', padding: '0 2px',
  };

  if (line.href) {
    return (
      <motion.a href={line.href} target="_blank" rel="noopener noreferrer"
        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18, delay }}
        style={{ ...base, textDecoration: 'none', borderBottom: `1px solid ${color}40`, cursor: 'pointer' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = color; }}
      >
        {line.text || '\u00A0'}
      </motion.a>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, x: slow ? -8 : -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: slow ? 0.25 : 0.18, delay }}
      style={base}
      onClick={() => line.text.trim() && onCopy(line.text, lineId)}
      onMouseEnter={e => { if (line.text.trim()) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      title={line.text.trim() ? 'Click to copy' : undefined}
    >
      {line.text || '\u00A0'}
    </motion.span>
  );
}
