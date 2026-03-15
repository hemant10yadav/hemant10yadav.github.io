# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack → http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

No test suite is configured. Always run `npm run build` to verify changes compile cleanly.

---

## Architecture

**Next.js 15 (App Router)** personal portfolio. TypeScript, Tailwind CSS, Framer Motion.

### Pages

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Main portfolio — Hero, Experience, Skills, Projects, LabTeaser |
| `/lab` | `src/app/lab/page.tsx` | Experiments page — Pulse + CLITerminal |

### Layout

`src/app/layout.tsx` is the root layout (server component). It wraps everything with:
- `ViewerProvider` — shared context across both pages
- `NavBar` — persistent navigation
- `GitHubActivity` — fixed activity badge (bottom-right)
- Flash-prevention `<script>` in `<head>` for color mode

---

## Key Contexts & State

### ViewerContext (`src/app/context/ViewerContext.tsx`)

Single source of truth for theme state. Every component reads from `useViewer()`.

```ts
const { viewerType, accent, colorMode, toggleViewerType, toggleColorMode } = useViewer();
```

| State | Values | Default | Persisted |
|---|---|---|---|
| `viewerType` | `'recruiter' \| 'developer'` | `'recruiter'` | URL `?mode=` |
| `colorMode` | `'dark' \| 'light'` | `'dark'` | `localStorage: hy_color_mode` |
| `accent` | hex string | computed | — |

**Accent colors** (change here — propagates everywhere):
- Dark / Recruiter: `#f2c078`  · Dark / Developer: `#22d3ee`
- Light / Recruiter: `#b45309` · Light / Developer: `#0891b2`

`data-theme="dark|light"` is set on `<html>` — CSS variables cascade from there.

---

## Color Token System (`src/app/globals.css`)

All colors are CSS custom properties. Never hardcode hex values in components.

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--bg` | `#080c14` | `#f0f4f8` | Page background |
| `--bg-surface` | `#0b1120` | `#ffffff` | Cards, modals |
| `--bg-chrome` | `#141c2e` | `#e8edf4` | Navbar, terminal chrome |
| `--bg-card` | `rgba(255,255,255,0.025)` | `rgba(0,0,0,0.025)` | Transparent cards |
| `--bg-input` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.04)` | Form inputs |
| `--bg-navbar` | `rgba(8,12,20,0.6)` | `rgba(240,244,248,0.6)` | Navbar default |
| `--bg-navbar-solid` | `rgba(8,12,20,0.92)` | `rgba(240,244,248,0.95)` | Navbar scrolled |
| `--bg-overlay` | `rgba(8,12,20,0.85)` | `rgba(240,244,248,0.85)` | Floating badges |
| `--fg` | `#e2e8f0` | `#0f172a` | Primary text |
| `--fg-2` | `#94a3b8` | `#334155` | Secondary text |
| `--fg-3` | `#64748b` | `#475569` | Muted text |
| `--fg-4` | `#475569` | `#64748b` | Dim text |
| `--fg-5` | `#334155` | `#94a3b8` | Very dim |
| `--fg-6` | `#2d3f55` | `#cbd5e1` | Ghost text |
| `--border` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.12)` | Strong border |
| `--border-2` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.07)` | Mid border |
| `--border-3` | `rgba(255,255,255,0.03)` | `rgba(0,0,0,0.03)` | Subtle border |

**Canvas elements** (SkillSection, Pulse gauge) cannot use CSS variables — pass `colorMode` from context and compute values in JS.

---

## Personal Data (`src/app/constants.ts`)

All personal/contact data lives here. Change once → updates everywhere.

```ts
FULL_NAME, TITLE, EMAIL, GITHUB_USERNAME, LINKEDIN_HANDLE, SO_USER_ID
GITHUB_URL, LINKEDIN_URL, SO_URL, SITE_URL, MAILTO
PROFILE_PIC_URL, RESUME_PDF_URL, RESUME_VIEW_URL, RESUME_EMBED_URL
CONTACT_SCRIPT_URL
DIMAGI, XCALIBER       // company objects: { name, url, period, location, current }
PROJECT_ECOMMERCE, PROJECT_ESTORE, PROJECT_BOOKSTORE  // { title, githubUrl, demoUrl? }
```

---

## Dual Viewer Mode

Content and accent color adapt based on `viewerType`. The toggle is in the Navbar (⇄ button). URL param `?mode=developer` opens directly in developer mode.

| | Recruiter | Developer |
|---|---|---|
| Experience | Visual timeline | Git log terminal style |
| Skills | Grouped by capability | Individual with honest notes |
| Projects | Problem / Solution / Impact | What I tried / broke / learned |
| Failures log | Hidden | Discoverable via terminal `ls -la` |

---

## Components

### Main page (`/`)
- `HeroSection` — intro, resume modal, social links, profile image
- `ExperienceSection` — dual-mode work history
- `SkillSection` — animated constellation canvas + skill grid
- `ProjectSection` — project cards with dual-mode content
- `LabTeaser` — prompt-style teaser linking to `/lab`

### Lab page (`/lab`)
- `Pulse` — live tech briefing: HN top stories, GitHub trending, npm spikes, animated arc gauge. 1hr localStorage cache.
- `CLITerminal` — interactive terminal with virtual filesystem. See below.

### Shared
- `Navbar` — viewer toggle (⇄), dark/light toggle (☀/🌙), `/lab` link, active section tracking
- `ProfileImage` — circular avatar with slow-spinning accent ring
- `GitHubActivity` — fixed badge, fetches latest GitHub event (5min sessionStorage cache)
- `MessageModal` / `MessageForm` — contact form, posts to Google Apps Script
- `EasterEgg` — hidden split-screen showing both viewer modes simultaneously

---

## CLITerminal — Virtual Filesystem

The terminal has a real virtual filesystem. Key files in `CLITerminal.tsx`:

- `FS_NODES` — flat map of absolute path → node metadata (`FSFile | FSDir`)
- `FS_CHILDREN` — map of directory path → child name array
- `HOME = '/home/visitor'` — starting directory

**Navigation**: `cd`, `ls [-la|-a]`, `cat`, `mkdir`, `touch`, `rm`, pipe with `grep`

**Hidden discovery path**: `ls -la` → reveals `.mistakes/` → `cat ~/.mistakes/production.log`

**Other hidden files**: `~/.bashrc`, `~/.gitconfig`, `~/.ssh/known_hosts`, `/var/log/career.log`, `/etc/passwd`

**Terminal window stays dark in both color modes** — intentional design decision.

All commands are tracked via Google Analytics: `event('terminal_command', { category: 'Terminal', label: cmd })`.

---

## Environment Variables

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=   # contact form (not actively enforced)
```

GitHub Actions secrets: `GA_MEASUREMENT_ID` (injected at build time).

---

## Deployment

Push to `main` → GitHub Actions (`.github/workflows/nextjs.yml`) → GitHub Pages.
Live at: `https://hemant10yadav.github.io`

---

## Do Not

- Do not hardcode hex color values in components — use CSS variables (`var(--fg)`, `var(--bg)`, etc.)
- Do not hardcode personal data (name, email, URLs) — import from `constants.ts`
- Do not hardcode accent colors — read `accent` from `useViewer()`
- Do not add canvas `strokeStyle`/`fillStyle` using CSS variables — they don't resolve; use JS values
- Do not skip `npm run build` after changes — TypeScript and ESLint errors block the CI deploy
