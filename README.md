# hemant10yadav.github.io

Personal portfolio built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Features a dual-viewer experience that adapts content and design based on whether the visitor is a recruiter or a developer.

**Live:** [hemant10yadav.github.io](https://hemant10yadav.github.io)

---

## Highlights

- **Dual Viewer Mode** — visitors choose between a recruiter view (amber accent, professional focus) and a developer view (cyan accent, technical depth including a failures log)
- **Cinematic Entry** — an interactive splash screen (`WatchingYou`) with phase-based transitions before revealing the main portfolio
- **Smooth Animations** — page sections animate in with Framer Motion; skill widgets, project cards, and the navbar all respond to scroll and interaction
- **GitHub Activity Feed** — live contribution data pulled directly from GitHub
- **Contact Form** — reCAPTCHA-protected message form with modal confirmation
- **Easter Egg** — hidden interactive surprise for curious visitors
- **Google Analytics** — pageview tracking via `nextjs-google-analytics`

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| UI Icons | Lucide React |
| Analytics | Google Analytics (`nextjs-google-analytics`) |
| Deployment | GitHub Pages via GitHub Actions |

---

## Getting Started

```bash
# Clone
git clone https://github.com/hemant10yadav/hemant10yadav.github.io.git
cd hemant10yadav.github.io

# Install
npm install

# Environment — create a .env file
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<your-recaptcha-site-key>

# Dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Other Commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Project Structure

```
src/app/
├── page.tsx                  # Root page — phase-based rendering (Act 1 → Fade → Portfolio)
├── layout.tsx                # Root layout with metadata and fonts
├── globals.css               # Global styles and Tailwind directives
├── context/
│   └── ViewerContext.tsx      # Recruiter / Developer viewer mode state
├── components/
│   ├── WatchingYou.tsx        # Interactive splash screen (Act 1)
│   ├── Navbar.tsx             # Sticky navigation bar
│   ├── HeroSection.tsx        # Intro, typing animation, social links
│   ├── ExperienceSection.tsx  # Work experience timeline
│   ├── SkillSection.tsx       # Tech stack grid
│   ├── SkillWidget.tsx        # Individual skill card
│   ├── ProjectSection.tsx     # Featured projects showcase
│   ├── GitHubActivity.tsx     # GitHub contribution feed
│   ├── FailuresLog.tsx        # Developer-only failures/learnings section
│   ├── MessageForm.tsx        # Contact form with reCAPTCHA
│   ├── MessageModal.tsx       # Message confirmation modal
│   ├── ProfileImage.tsx       # Profile image component
│   └── EasterEgg.tsx          # Hidden easter egg
├── def/
│   └── types.ts               # Shared type definitions
└── hooks/
    └── useMousePosition.ts    # Custom hook for mouse tracking
```

---

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/nextjs.yml`) which builds and deploys to GitHub Pages. The `GA_MEASUREMENT_ID` secret is injected at build time.

---

## Connect

- **GitHub:** [@hemant10yadav](https://github.com/hemant10yadav)
- **LinkedIn:** [Hemant Yadav](https://www.linkedin.com/in/hemantyad)
- **Email:** [hemant.10.yadav@gmail.com](mailto:hemant.10.yadav@gmail.com)
