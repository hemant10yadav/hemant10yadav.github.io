'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  cmd: string | null; // null = welcome message
  output: Line[];
}

// ── constants ─────────────────────────────────────────────────────────────────

const RESUME_PDF = RESUME_PDF_URL;
const RESUME_VIEW = RESUME_VIEW_URL;

const WELCOME: Line[] = [
  { text: '╔════════════════════════════════════════════════════╗', color: 'dim' },
  { text: '║   hemant@portfolio  ·  v1.0.0  ·  interactive cli  ║', color: 'accent' },
  { text: '╚════════════════════════════════════════════════════╝', color: 'dim' },
  { text: '' },
  { text: "  Type 'help' to see all commands.", color: 'muted' },
  { text: '  Some commands have surprises. Explore.', color: 'dim' },
  { text: '' },
];

// ── static command outputs ────────────────────────────────────────────────────

const STATIC_COMMANDS: Record<string, Line[]> = {
  whoami: [
    { text: FULL_NAME, color: 'accent' },
    { text: 'Software Engineer · 4+ years', color: 'normal' },
    { text: `Currently @ ${DIMAGI.name}`, color: 'muted' },
    { text: '' },
    { text: '"I build for the person on-call at 3am."', color: 'dim' },
  ],

  about: [
    { text: 'Software engineer', color: 'normal' },
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
    { text: `Email     ${EMAIL}`,                                   color: 'normal', href: MAILTO },
    { text: `GitHub    github.com/${GITHUB_USERNAME}`,              color: 'normal', href: GITHUB_URL },
    { text: `LinkedIn  linkedin.com/in/${LINKEDIN_HANDLE}`,         color: 'normal', href: LINKEDIN_URL },
    { text: `Stack     ${SO_URL.replace('https://', '')}`,          color: 'normal', href: SO_URL },
  ],

  resume: [
    { text: '↗ View online', color: 'blue', href: RESUME_VIEW },
    { text: '↓ Download PDF', color: 'blue', href: RESUME_PDF },
  ],

  ls: [
    { text: 'about/     contact/     experience/     projects/     skills/', color: 'accent' },
  ],

  pwd: [
    { text: '/home/visitor/hemant-portfolio', color: 'normal' },
  ],

  uname: [
    { text: 'hemant-portfolio Darwin 24.0.0 arm64', color: 'normal' },
  ],

  'echo $USER': [
    { text: 'visitor', color: 'normal' },
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
    { text: `          ██████           visitor@${GITHUB_USERNAME}-portfolio`, color: 'accent' },
    { text: '        ██      ██         ─────────────────────────', color: 'accent' },
    { text: '      ██  ████  ██         OS: Portfolio v1.0.0', color: 'normal' },
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
    { text: 'added 1 package in 4 years', color: 'green' },
    { text: '' },
    { text: '1 package is looking for funding', color: 'muted' },
    { text: '  run `npm fund` for details', color: 'dim' },
  ],

  'ping google.com': [
    { text: 'PING google.com: 56 data bytes', color: 'normal' },
    { text: '64 bytes from 142.250.80.46: icmp_seq=0 ttl=116 time=12.3 ms', color: 'muted' },
    { text: '64 bytes from 142.250.80.46: icmp_seq=1 ttl=116 time=11.8 ms', color: 'muted' },
    { text: '' },
    { text: '(now hire me to build fast systems)', color: 'dim' },
  ],
};

// ── dynamic help command (depends on current mode) ────────────────────────────

function getHelp(viewerType: string): Line[] {
  const otherMode = viewerType === 'recruiter' ? 'developer' : 'recruiter';
  return [
    { text: '┌── Commands ──────────────────────────────────────────┐', color: 'dim' },
    { text: '│', color: 'dim' },
    { text: '│  whoami       who am I?', color: 'normal' },
    { text: '│  about        background & philosophy', color: 'normal' },
    { text: '│  skills       tech stack', color: 'normal' },
    { text: '│  experience   work history', color: 'normal' },
    { text: '│  projects     things I built', color: 'normal' },
    { text: '│  contact      reach me', color: 'normal' },
    { text: '│  resume       view / download resume', color: 'normal' },
    { text: `│  mode         switch to ${otherMode} view`, color: 'normal' },
    { text: '│  clear        clear terminal', color: 'normal' },
    { text: '│', color: 'dim' },
    { text: '│  Tab          autocomplete', color: 'dim' },
    { text: '│  ↑ / ↓        command history', color: 'dim' },
    { text: '│  Ctrl+C       cancel input', color: 'dim' },
    { text: '│', color: 'dim' },
    { text: '└──────────────────────────────────────────────────────┘', color: 'dim' },
    { text: '' },
    { text: "  There are hidden commands. Explore.", color: 'dim' },
  ];
}

// ── color resolver ────────────────────────────────────────────────────────────

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

// ── all known command names (for tab completion) ──────────────────────────────

const ALL_CMDS = [
  'help', 'whoami', 'about', 'skills', 'experience', 'projects',
  'contact', 'resume', 'mode', 'clear', 'ls', 'pwd', 'uname',
  'neofetch', 'vim', 'nano', 'exit', 'git log', 'git blame',
  'git status', 'ssh hemant', 'sudo hire-me', 'rm -rf bugs',
  'curl ifconfig.me', 'npm install talent', 'cat /etc/motivation',
  'ping google.com', 'echo $USER',
];

// ── component ─────────────────────────────────────────────────────────────────

export default function CLITerminal() {
  const { viewerType, accent, toggleViewerType } = useViewer();

  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: 0, cmd: null, output: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  // Auto-scroll to bottom on new entry
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  // Global shortcut: backtick focuses terminal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '`' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const addEntry = useCallback((cmd: string, output: Line[]) => {
    setHistory((prev) => [...prev, { id: idRef.current++, cmd, output }]);
  }, []);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      const lower = cmd.toLowerCase();

      setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
      setCmdIdx(-1);

      // ── built-ins ──────────────────────────────────────────────────────────

      if (lower === 'clear') {
        setHistory([{ id: idRef.current++, cmd: null, output: WELCOME }]);
        return;
      }

      if (lower === 'help') {
        addEntry(cmd, getHelp(viewerType));
        return;
      }

      if (lower === 'mode') {
        const next = viewerType === 'recruiter' ? 'developer' : 'recruiter';
        toggleViewerType();
        addEntry(cmd, [
          { text: `✓ Switched to ${next} view.`, color: 'green' },
          { text: '  Scroll up — the whole site just changed.', color: 'dim' },
        ]);
        return;
      }

      if (lower === 'date') {
        addEntry(cmd, [{ text: new Date().toLocaleString(), color: 'normal' }]);
        return;
      }

      // ── static commands ────────────────────────────────────────────────────

      if (lower in STATIC_COMMANDS) {
        addEntry(cmd, STATIC_COMMANDS[lower]);
        return;
      }

      // ── unknown ────────────────────────────────────────────────────────────

      addEntry(cmd, [
        { text: `zsh: command not found: ${cmd}`, color: 'red' },
        { text: "Type 'help' for available commands.", color: 'dim' },
      ]);
    },
    [viewerType, toggleViewerType, addEntry],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      const match = ALL_CMDS.find(
        (c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase(),
      );
      if (match) setInput(match);
    } else if (e.key === 'c' && e.ctrlKey) {
      setInput('');
    }
  };

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
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#e2e8f0',
              margin: 0,
            }}
          >
            Terminal
          </h2>
          <span
            style={{
              fontSize: '0.6rem',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: '#475569',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            Interactive
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.65rem',
            color: '#2d3f55',
          }}
        >
          press <span style={{ color: accent }}>` </span>anywhere to focus
        </span>
      </motion.div>

      {/* Terminal window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={() => inputRef.current?.focus()}
        style={{
          background: '#060a12',
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${isFocused ? `${accent}35` : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isFocused ? `0 0 30px ${accent}10` : '0 0 0px transparent',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          cursor: 'text',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
        }}
      >
        {/* Chrome bar */}
        <div
          style={{
            background: '#0d1117',
            padding: '0.65rem 1rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            userSelect: 'none',
          }}
        >
          {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
            <span
              key={c}
              style={{
                width: '0.55rem',
                height: '0.55rem',
                borderRadius: '50%',
                background: c,
                display: 'block',
                opacity: 0.75,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.68rem',
              color: '#2d3f55',
              marginLeft: '0.4rem',
            }}
          >
            visitor@hemant — portfolio
          </span>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          style={{
            height: 'clamp(320px, 50vh, 480px)',
            overflowY: 'auto',
            padding: '1rem 1.25rem 0.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: `${accent}20 transparent`,
          }}
        >
          {history.map((entry) => (
            <div key={entry.id} style={{ marginBottom: '0.5rem' }}>
              {/* Command echo */}
              {entry.cmd !== null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  <Prompt />
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: '0.82rem',
                      color: '#e2e8f0',
                    }}
                  >
                    {entry.cmd}
                  </span>
                </div>
              )}

              {/* Output */}
              <AnimatePresence>
                {entry.output.map((line, li) => (
                  <OutputLine
                    key={li}
                    line={line}
                    index={li}
                  />
                ))}
              </AnimatePresence>
            </div>
          ))}

          {/* Live input line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingBottom: '0.75rem',
            }}
          >
            <Prompt />
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
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.82rem',
                color: '#e2e8f0',
                caretColor: accent,
                minWidth: 0,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Hint row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginTop: '0.75rem',
          paddingLeft: '0.25rem',
        }}
      >
        {[
          ['Tab', 'autocomplete'],
          ['↑↓', 'history'],
          ['Ctrl+C', 'cancel'],
          ['clear', 'reset'],
        ].map(([key, desc]) => (
          <span
            key={key}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.6rem',
              color: '#1e2d3d',
            }}
          >
            <span style={{ color: accent }}>{key}</span> {desc}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function Prompt() {
  return (
    <span
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "0.75rem",
        userSelect: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <span style={{ color: "#475569" }}>visitor</span>
      <span style={{ color: "#2d3f55" }}>@</span>
      <span style={{ color: "#2d3f55" }}>hemant</span>
      <span style={{ color: "#2d3f55" }}>:~$</span>
    </span>
  );
}

function OutputLine({ line, index }: { line: Line; index: number }) {
  const { accent } = useViewer();
  const color = resolveColor(line.color, accent);
  const base: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains-mono), monospace',
    fontSize: '0.78rem',
    lineHeight: 1.65,
    color,
    display: 'block',
    whiteSpace: 'pre',
    minHeight: '1.1em',
  };

  if (line.href) {
    return (
      <motion.a
        href={line.href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, delay: index * 0.03 }}
        style={{
          ...base,
          textDecoration: 'none',
          cursor: 'pointer',
          borderBottom: `1px solid ${color}40`,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = accent;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = color;
        }}
      >
        {line.text || '\u00A0'}
      </motion.a>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, delay: index * 0.03 }}
      style={base}
    >
      {line.text || '\u00A0'}
    </motion.span>
  );
}
