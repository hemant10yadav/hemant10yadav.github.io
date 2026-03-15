# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

No test suite is configured.

## Architecture

This is a **Next.js 15 (App Router)** personal portfolio site using TypeScript, Tailwind CSS, and Framer Motion. All source lives under `src/app/`.

### Dual Viewer Mode

The core architectural concept is a **viewer mode system** (`context/ViewerContext.tsx`) that switches between `'recruiter'` and `'developer'` modes. Components conditionally render content, color schemes, and sections based on this context:
- Recruiter: amber accent (`#f59e0b`), professional-focused content
- Developer: cyan accent (`#22d3ee`), technical content including `FailuresLog`

### Phase-based Rendering

`page.tsx` renders the portfolio in phases managed by local state:
1. **Act 1** (`WatchingYou` component) — interactive splash screen
2. **Fading** — black overlay transition
3. **Portfolio** — full site with `Navbar`, `HeroSection`, `ExperienceSection`, `ProjectSection`, `SkillSection`, `GitHubActivity`, `MessageForm`

### Path Alias

`@/*` maps to `./src/*` — use this for all imports within `src/`.

### Environment Variables

`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is required (in `.env`) for the contact form (`MessageForm`/`MessageModal`).

### Deployment

GitHub Actions (`.github/workflows/nextjs.yml`) auto-deploys to GitHub Pages on push to `main`. The `GA_MEASUREMENT_ID` secret is injected at build time for Google Analytics.
