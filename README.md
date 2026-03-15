# hemant10yadav.github.io

Personal portfolio of **Hemant Singh Yadav** — Software Engineer.
Built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

**Live → [hemant10yadav.github.io](https://hemant10yadav.github.io)**

---

## Features

### Dual Viewer Mode
The entire site adapts based on the viewer — recruiter or developer. Toggle via the navbar pill or append `?mode=developer` to the URL. Mode persists across navigation.

| | Recruiter | Developer |
|---|---|---|
| Accent | Warm gold `#f2c078` | Cyan `#22d3ee` |
| Experience | Impact timeline | Git log terminal |
| Skills | Grouped by capability | Individual with honest annotations |
| Projects | Problem / Solution / Impact | What I tried / What broke / What I learned |

### /lab — Experiments Page
A dedicated page for interactive tools, linked from the main portfolio.

- **Pulse** — live tech briefing: Hacker News top stories, GitHub trending repos, npm package spikes, and an animated "tech temperature" gauge. Cached in localStorage for 1 hour.
- **Terminal** — fully interactive CLI with a virtual filesystem. Navigate with `cd`, `ls`, `cat`. Discover hidden files. Every command tracked via Google Analytics.

### Terminal Features
Real terminal behaviour: `cd`, `ls [-la|-a]`, `cat`, `mkdir`, `touch`, `rm`, pipe with `grep`.
Keyboard shortcuts: `Ctrl+R` reverse search, `Ctrl+L` clear, `Ctrl+A/E` line navigation, `Ctrl+W` delete word, `Tab` path-aware autocomplete.
Hidden files under `~/.mistakes/`, `~/.gitconfig`, `~/.bashrc`, `/var/log/career.log`.

### Other
- GitHub activity badge — live latest push, fixed bottom-right
- Easter egg — split-screen both views simultaneously
- Contact modal with Google Apps Script form backend
- Google Analytics event tracking throughout

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + inline styles |
| Animations | Framer Motion |
| Icons | Lucide React |
| Analytics | `nextjs-google-analytics` |
| Deployment | GitHub Pages via GitHub Actions |

---

## Getting Started

```bash
git clone https://github.com/hemant10yadav/hemant10yadav.github.io.git
cd hemant10yadav.github.io
npm install
```

Create a `.env` file:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_key_here
```

```bash
npm run dev      # Start dev server (Turbopack) → http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

---

## Project Structure

```
src/app/
├── page.tsx                    # Main portfolio page
├── layout.tsx                  # Root layout — ViewerProvider, Navbar, GitHubActivity
├── globals.css                 # Global styles & keyframe animations
├── constants.ts                # Single source of truth for all personal data
│
├── lab/
│   └── page.tsx                # /lab page — Pulse + Terminal
│
├── context/
│   └── ViewerContext.tsx       # Viewer mode state + accent colours
│
└── components/
    ├── Navbar.tsx              # Sticky nav — viewer toggle, /lab link, active section
    ├── HeroSection.tsx         # Intro, CTAs, social links, profile image, resume modal
    ├── ExperienceSection.tsx   # Timeline (recruiter) / git log (developer)
    ├── SkillSection.tsx        # Constellation canvas + skill grid
    ├── ProjectSection.tsx      # Project cards with recruiter/developer variants
    ├── ProfileImage.tsx        # Circular avatar with animated accent ring
    ├── Pulse.tsx               # Live tech briefing — HN, GitHub trending, npm, gauge
    ├── CLITerminal.tsx         # Interactive terminal with virtual filesystem
    ├── LabTeaser.tsx           # Teaser card linking to /lab from main page
    ├── GitHubActivity.tsx      # Fixed activity badge — fetches latest GitHub event
    ├── MessageModal.tsx        # Contact modal
    ├── MessageForm.tsx         # Form — posts to Google Apps Script endpoint
    ├── EasterEgg.tsx           # Hidden split-screen both-views overlay
    └── SkillWidget.tsx         # Skill icon card (recruiter view)
```

---

## Key Architecture

**Centralised constants** — `src/app/constants.ts` holds all personal data (name, email, URLs, company details, project links). Change once, updates everywhere.

**Centralised theme** — accent colours live in `ViewerContext.tsx` as `RECRUITER_ACCENT` and `DEVELOPER_ACCENT`. All components read `accent` from `useViewer()`.

**URL-synced viewer mode** — `?mode=recruiter` or `?mode=developer`. Defaults to recruiter. Shareable links open directly in the correct mode.

**Virtual filesystem** — the terminal's `FS_NODES` and `FS_CHILDREN` maps in `CLITerminal.tsx` define a navigable directory tree. Hidden files (dotfiles) require `ls -a` to discover.

---

## Deployment

Pushes to `main` trigger `.github/workflows/nextjs.yml` → builds and deploys to GitHub Pages.
The `GA_MEASUREMENT_ID` secret is injected at build time for analytics.

---

## Contact

[hemant.10.yadav@gmail.com](mailto:hemant.10.yadav@gmail.com) · [GitHub](https://github.com/hemant10yadav) · [LinkedIn](https://www.linkedin.com/in/hemantyad)
