'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { ViewerType, useViewer } from '../context/ViewerContext';
import { PROJECT_KICKTRACK, PROJECT_ECOMMERCE, PROJECT_ESTORE, PROJECT_BOOKSTORE } from '../constants';

interface ProjectSectionProps {
  viewerType: NonNullable<ViewerType>;
}

// ── project data for both views ──────────────────────────────────────────────

const FEATURED_STACK = 'Python · YOLO26 · BoT-SORT · OpenCV · CoreML · FastAPI';

const FEATURED_RECRUITER = {
  title: PROJECT_KICKTRACK.title,
  tagline: 'Computer-vision player tracking for football match footage',
  sections: [
    {
      label: 'Problem',
      text: 'Match footage is full of performance data (distance, speed, positioning, team shape), but getting at it means tracking every player in every frame, in real time.',
    },
    {
      label: 'Solution',
      text: 'YOLO detection running on Apple\'s Neural Engine via CoreML, BoT-SORT tracking with camera-motion compensation, an identity layer anchored to jersey colour, and an async inference thread so playback never stutters.',
    },
    {
      label: 'Impact',
      text: 'Tracks every player on 4K, 50fps footage with live markers. Cut inference from ~70ms to ~30ms per frame and frame drops on the hardest clip from 64% to 33%, without losing a single real detection. Backed by a replay test suite.',
    },
  ],
};

const FEATURED_DEVELOPER = {
  title: PROJECT_KICKTRACK.title,
  tagline: 'the one that actually fought back',
  sections: [
    {
      label: 'What I tried',
      text: 'ByteTrack, because it\'s fast and simple. The aerial footage pans slightly, and IoU-only matching handed out a new player ID almost every frame. Moved to BoT-SORT for camera-motion compensation.',
    },
    {
      label: 'What broke',
      text: 'IDs still swapped with no lost track: the detector returned one box over two overlapping players, and when it shrank back the ID landed on the wrong body. A goalkeeper\'s ID walked off with a defender.',
    },
    {
      label: 'What I learned',
      text: 'Verify visually, not just by counters. Every smaller, faster model "passed" the benchmarks while missing real players. The fix was anchoring identity to jersey colour and an NMS-free YOLO26 head, checked frame by frame.',
    },
  ],
};

const RECRUITER_PROJECTS = [
  {
    title: PROJECT_ECOMMERCE.title,
    problem: 'Personal project to explore full-stack architecture — from auth to checkout — using a Java + Angular stack.',
    solution: 'Spring Boot REST API, Angular SPA, PostgreSQL with clean schema design, JWT auth with layered service/repository separation.',
    impact: 'Demonstrates system design thinking: bounded contexts, DTO patterns, and an architecture structured to scale.',
    githubLink: PROJECT_ECOMMERCE.githubUrl,
    tech: ['java.png', 'spring.png', 'angular.png', 'typescript.png', 'postgres.png'],
  },
  {
    title: PROJECT_ESTORE.title,
    problem: 'Side project to learn the MERN stack end-to-end — from React component design to MongoDB document modelling.',
    solution: 'React frontend, Node/Express REST APIs, MongoDB with Mongoose, auth and session handling.',
    impact: 'Shows ability to pick up a new stack independently and deliver a complete, working full-stack application.',
    githubLink: PROJECT_ESTORE.githubUrl,
    tech: ['typescript.png', 'react.png', 'node.png', 'express.png', 'mongo.png'],
  },
  {
    title: PROJECT_BOOKSTORE.title,
    problem: 'Side project to practice Angular\'s component model and API integration — no backend required.',
    solution: 'Angular SPA consuming the Google Books API, search by title/author/keyword, rich detail views, deployed on GitHub Pages.',
    impact: 'Live demo available. Shows frontend-first thinking: fast load, responsive UI, zero infrastructure overhead.',
    githubLink: PROJECT_BOOKSTORE.githubUrl,
    demoUrl: PROJECT_BOOKSTORE.demoUrl,
    tech: ['bootstrap.png', 'angular.png', 'typescript.png'],
  },
];

const DEVELOPER_PROJECTS = [
  {
    title: PROJECT_ECOMMERCE.title,
    tried: 'Started with a custom auth system with refresh token rotation and per-device sessions. Very elegant. Very overengineered.',
    broke: 'Broke in staging when two concurrent requests hit the token refresh endpoint. Race condition.',
    learned: 'Boring code is good code. Simplified to standard JWT + stateless. Shipped. Never thought about it again.',
    githubLink: PROJECT_ECOMMERCE.githubUrl,
    tech: ['java.png', 'spring.png', 'angular.png', 'typescript.png', 'postgres.png'],
  },
  {
    title: PROJECT_ESTORE.title,
    tried: 'MongoDB because "schemaless = flexible." Designed the product documents to hold everything: reviews, variants, stock.',
    broke: 'Querying nested arrays for specific review authors became an aggregation pipeline nightmare.',
    learned: 'Schema-less doesn\'t mean schema-free. Design your documents for how you read, not how you write.',
    githubLink: PROJECT_ESTORE.githubUrl,
    tech: ['typescript.png', 'react.png', 'node.png', 'express.png', 'mongo.png'],
  },
  {
    title: PROJECT_BOOKSTORE.title,
    tried: 'Wanted infinite scroll, offline caching, and a custom debounce hook — for a book search page.',
    broke: 'Nothing broke, but I spent 3 days on things no user would notice.',
    learned: 'Sometimes a simple input + button is the product. Shipped a fast, usable app. Live demo still runs.',
    githubLink: PROJECT_BOOKSTORE.githubUrl,
    demoUrl: PROJECT_BOOKSTORE.demoUrl,
    tech: ['bootstrap.png', 'angular.png', 'typescript.png'],
  },
];

export const ProjectSection = ({ viewerType }: ProjectSectionProps) => {
  const { accent } = useViewer();
  const isRecruiter = viewerType === 'recruiter';

  const handleCodeView = (projectName: string) => {
    event('Code views', { category: 'Portfolio', label: projectName, value: 1 });
  };

  const handleDemoClick = (url: string, title: string) => {
    event('demo_viewed', { category: 'Portfolio', label: title, value: 1 });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="container mx-auto px-6">
        <motion.div
          key={viewerType}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
          }}
          className="mb-16"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, x: -14 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
            }}
            style={{
              display: 'inline-block',
              padding: '0.2rem 0.75rem',
              borderRadius: '4px',
              background: `${accent}14`,
              color: accent,
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              marginBottom: '0.75rem',
            }}
          >
            {isRecruiter ? 'Projects' : '// projects'}
          </motion.span>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            style={{
              fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--fg)',
              display: 'block',
            }}
          >
            {isRecruiter ? 'Things I built' : 'What actually happened'}
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
            }}
            style={{ color: 'var(--fg-4)', marginTop: '0.4rem', fontSize: '0.875rem' }}>
            {isRecruiter
              ? 'personal projects · real decisions · code on GitHub'
              : 'the unedited version'}
          </motion.p>
        </motion.div>

        <FeaturedCard
          key={`featured-${viewerType}`}
          project={isRecruiter ? FEATURED_RECRUITER : FEATURED_DEVELOPER}
          isRecruiter={isRecruiter}
          accent={accent}
          onCodeView={() => handleCodeView(PROJECT_KICKTRACK.title)}
        />

        <p
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: 'var(--fg-4)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '3.5rem',
            marginBottom: '1.25rem',
          }}
        >
          {isRecruiter ? 'Earlier projects' : '// earlier, simpler times'}
        </p>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}
        >
          {isRecruiter
            ? (RECRUITER_PROJECTS as typeof RECRUITER_PROJECTS).map((project, i) => (
                <RecruiterCard
                  key={project.title}
                  project={project}
                  index={i}
                  accent={accent}
                  onCodeView={() => handleCodeView(project.title)}
                  onDemoClick={() => project.demoUrl && handleDemoClick(project.demoUrl, project.title)}
                />
              ))
            : (DEVELOPER_PROJECTS as typeof DEVELOPER_PROJECTS).map((project, i) => (
                <DeveloperCard
                  key={project.title}
                  project={project}
                  index={i}
                  accent={accent}
                  onCodeView={() => handleCodeView(project.title)}
                  onDemoClick={() => project.demoUrl && handleDemoClick(project.demoUrl, project.title)}
                />
              ))}
        </div>
      </div>

    </>
  );
};

// ── sub-components ────────────────────────────────────────────────────────────

const DEMOS_CACHE_KEY = 'hy_kicktrack_demos';
const DEMOS_CACHE_TTL = 60 * 60 * 1000; // 1 hr — the GitHub API allows 60 unauthenticated requests/hr

interface DemoVideo {
  src: string;
  poster?: string;
}

async function fetchDemoVideos(): Promise<DemoVideo[]> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(DEMOS_CACHE_KEY) ?? 'null');
    if (cached && Date.now() - cached.fetchedAt < DEMOS_CACHE_TTL) return cached.videos;
  } catch { /* ignore */ }

  const res = await fetch(PROJECT_KICKTRACK.demosApiUrl);
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const names = new Set(((await res.json()) as { name: string }[]).map((f) => f.name));

  const videos = [...names]
    .filter((name) => name.toLowerCase().endsWith('.mp4'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => {
      const poster = name.replace(/\.mp4$/i, '.jpg');
      return {
        src: `${PROJECT_KICKTRACK.demosBaseUrl}/${name}`,
        poster: names.has(poster) ? `${PROJECT_KICKTRACK.demosBaseUrl}/${poster}` : undefined,
      };
    });

  try {
    sessionStorage.setItem(DEMOS_CACHE_KEY, JSON.stringify({ videos, fetchedAt: Date.now() }));
  } catch { /* ignore */ }
  return videos;
}

function DemoPlayer({
  title,
  accent,
  onAllFailed,
}: {
  title: string;
  accent: string;
  onAllFailed: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [demos, setDemos] = useState<DemoVideo[] | null>(null);
  const [active, setActive] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const current = demos?.[active];
  const label = `Video ${active + 1}`;

  useEffect(() => {
    fetchDemoVideos()
      .then((videos) => (videos.length ? setDemos(videos) : onAllFailed()))
      .catch(onAllFailed);
  }, [onAllFailed]);

  useEffect(() => {
    const onChange = () => {
      const entered = document.fullscreenElement === videoRef.current;
      setIsFullscreen(entered);
      if (entered) event('demo_fullscreen', { category: 'Portfolio', label });
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [label]);

  if (!demos || !current) {
    // Reserve the space while the clip list loads so the card doesn't jump
    return (
      <div
        style={{
          borderRadius: '10px',
          border: '1px solid var(--border-2)',
          background: 'var(--bg-surface)',
          aspectRatio: '16 / 9',
        }}
      />
    );
  }

  const handleError = () => {
    const next = new Set(failed).add(active);
    setFailed(next);
    const fallback = demos.findIndex((_, i) => !next.has(i));
    if (fallback === -1) onAllFailed();
    else setActive(fallback);
  };

  return (
    <div>
      <div
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid var(--border-2)',
          background: 'var(--bg-surface)',
          aspectRatio: '16 / 9',
        }}
      >
        <video
          ref={videoRef}
          key={current.src}
          src={current.src}
          poster={current.poster}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          onError={handleError}
          aria-label={`${title} demo: ${label}, live player tracking on match footage`}
          style={{ width: '100%', height: '100%', objectFit: isFullscreen ? 'contain' : 'cover', display: 'block' }}
        />
      </div>

      {demos.length - failed.size > 1 && (
        <div className="flex flex-wrap gap-2 mt-3" role="tablist" aria-label="Demo clips">
          {demos.map((video, i) =>
            failed.has(i) ? null : (
              <button
                key={video.src}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.72rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '6px',
                  border: `1px solid ${i === active ? accent : 'var(--border-2)'}`,
                  background: i === active ? `${accent}1a` : 'transparent',
                  color: i === active ? accent : 'var(--fg-3)',
                  transition: 'all 0.2s',
                }}
              >
                Video {i + 1}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function FeaturedCard({
  project,
  isRecruiter,
  accent,
  onCodeView,
}: {
  project: typeof FEATURED_RECRUITER;
  isRecruiter: boolean;
  accent: string;
  onCodeView: () => void;
}) {
  // Hide the media pane if the demo video is missing, instead of showing a broken player
  const [videoFailed, setVideoFailed] = useState(false);
  const hideVideo = useCallback(() => setVideoFailed(true), []);
  const labelColors = isRecruiter
    ? [accent, accent, 'var(--color-success)']
    : [accent, 'var(--color-danger)', 'var(--color-success)'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`grid gap-8 items-center ${videoFailed ? '' : 'lg:grid-cols-[1.15fr_1fr]'}`}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${accent}33`,
        borderRadius: '16px',
        padding: 'clamp(1.25rem, 4vw, 2rem)',
      }}
    >
      {!videoFailed && (
        <DemoPlayer title={project.title} accent={accent} onAllFailed={hideVideo} />
      )}

      <div>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: accent,
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {isRecruiter ? '★ Featured · in progress' : '// featured --wip'}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
            color: 'var(--fg)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginTop: '0.35rem',
          }}
        >
          {project.title}
        </h3>
        <p style={{ color: 'var(--fg-3)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          {project.tagline}
        </p>

        {project.sections.map(({ label, text }, i) => (
          <div key={label} className="mb-3">
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                color: labelColors[i],
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              {label}
            </span>
            <p style={{ color: 'var(--fg-2)', fontSize: '0.875rem', lineHeight: 1.65 }}>{text}</p>
          </div>
        ))}

        <div className="flex items-center gap-3 mt-4 mb-4">
          <Image
            src="/assets/python.png"
            alt="python"
            width={28}
            height={28}
            className="object-contain"
            loading="lazy"
            draggable={false}
          />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: 'var(--fg-4)',
              fontSize: '0.75rem',
            }}
          >
            {FEATURED_STACK}
          </span>
        </div>

        {PROJECT_KICKTRACK.repoPublic ? (
          <ProjectLinks
            githubLink={PROJECT_KICKTRACK.githubUrl}
            accent={accent}
            onCodeView={onCodeView}
            onDemoClick={() => {}}
          />
        ) : (
          <span style={{ color: 'var(--fg-4)', fontSize: '0.875rem' }}>
            Code going public soon
          </span>
        )}
      </div>
    </motion.div>
  );
}

interface RecruiterProject {
  title: string;
  problem: string;
  solution: string;
  impact: string;
  githubLink: string;
  demoUrl?: string;
  tech: string[];
}

interface DeveloperProject {
  title: string;
  tried: string;
  broke: string;
  learned: string;
  githubLink: string;
  demoUrl?: string;
  tech: string[];
}

function RecruiterCard({
  project,
  index,
  accent,
  onCodeView,
  onDemoClick,
}: {
  project: RecruiterProject;
  index: number;
  accent: string;
  onCodeView: () => void;
  onDemoClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(110,231,183,0.12)',
        borderRadius: '12px',
        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          color: 'var(--fg)',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        {project.title}
      </h3>

      {[
        { label: 'Problem',  text: project.problem,  color: accent },
        { label: 'Solution', text: project.solution, color: accent },
        { label: 'Impact',   text: project.impact,   color: 'var(--color-success)' },
      ].map(({ label, text, color }) => (
        <div key={label} className="mb-3">
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            {label}
          </span>
          <p style={{ color: 'var(--fg-2)', fontSize: '0.875rem', lineHeight: 1.65 }}>{text}</p>
        </div>
      ))}

      <TechRow icons={project.tech} />
      <ProjectLinks
        githubLink={project.githubLink}
        demoUrl={project.demoUrl}
        accent={accent}
        onCodeView={onCodeView}
        onDemoClick={onDemoClick}
      />
    </motion.div>
  );
}

function DeveloperCard({
  project,
  index,
  accent,
  onCodeView,
  onDemoClick,
}: {
  project: DeveloperProject;
  index: number;
  accent: string;
  onCodeView: () => void;
  onDemoClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(34,211,238,0.12)',
        borderRadius: '12px',
        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          color: 'var(--fg)',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        {project.title}
      </h3>

      {[
        { label: 'What I tried', text: project.tried, color: accent },
        { label: 'What broke',   text: project.broke,   color: 'var(--color-danger)' },
        { label: 'What I learned', text: project.learned, color: 'var(--color-success)' },
      ].map(({ label, text, color }) => (
        <div key={label} className="mb-3">
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            {label}
          </span>
          <p style={{ color: 'var(--fg-2)', fontSize: '0.875rem', lineHeight: 1.65 }}>{text}</p>
        </div>
      ))}

      <TechRow icons={project.tech} />
      <ProjectLinks
        githubLink={project.githubLink}
        demoUrl={project.demoUrl}
        accent={accent}
        onCodeView={onCodeView}
        onDemoClick={onDemoClick}
      />
    </motion.div>
  );
}

function TechRow({ icons }: { icons: string[] }) {
  return (
    <div className="flex gap-3 mt-4 mb-4">
      {icons.map((icon, i) => (
        <Image
          key={i}
          src={`/assets/${icon}`}
          alt={icon}
          width={28}
          height={28}
          className="object-contain"
          loading="lazy"
          draggable={false}
        />
      ))}
    </div>
  );
}

function ProjectLinks({
  githubLink,
  demoUrl,
  accent,
  onCodeView,
  onDemoClick,
}: {
  githubLink: string;
  demoUrl?: string;
  accent: string;
  onCodeView: () => void;
  onDemoClick: () => void;
}) {
  return (
    <div className="flex gap-4 mt-1">
      <motion.a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCodeView}
        className="inline-flex items-center gap-1.5"
        style={{ color: accent, fontSize: '0.875rem', textDecoration: 'none' }}
        whileHover={{ x: 4 }}
      >
        View Code <ExternalLink size={14} />
      </motion.a>
      {demoUrl && (
        <motion.button
          onClick={onDemoClick}
          className="inline-flex items-center gap-1.5"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--fg-3)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            padding: 0,
          }}
          whileHover={{ x: 4, color: 'var(--fg-2)' }}
        >
          Live Demo
        </motion.button>
      )}
    </div>
  );
}

export default ProjectSection;
