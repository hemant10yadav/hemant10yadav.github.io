'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, ExternalLink, Github, Maximize2, Minimize2, Pause, Play } from 'lucide-react';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { ViewerType, useViewer } from '../context/ViewerContext';
import { PROJECT_KICKTRACK, PROJECT_ECOMMERCE, PROJECT_ESTORE, PROJECT_BOOKSTORE } from '../constants';

interface ProjectSectionProps {
  viewerType: NonNullable<ViewerType>;
}

// ── project data for both views ──────────────────────────────────────────────

const FEATURED_STACK = ['Python', 'YOLO26s', 'BoT-SORT', 'OpenCV', 'CoreML', 'PnLCalib'];

const FEATURED_RECRUITER = {
  title: PROJECT_KICKTRACK.title,
  tagline: 'Football analytics from match video: tracks every player in real time and measures their distance, speed and passes in metres.',
  metrics: [
    { value: '64% → 1%', label: 'frames skipped on 50fps footage, down to almost none' },
    { value: '19 / 19', label: 'frames two overlapping players keep their IDs (was 3)' },
    { value: '8 of 9', label: 'hand-labelled passes found, none invented' },
  ],
  sections: [
    {
      label: 'Problem',
      text: 'Match footage is full of performance data (distance, speed, positioning, passes), but getting at it means tracking every player in every frame, in real time.',
    },
    {
      label: 'Solution',
      text: 'YOLO26s detection on Apple\'s Neural Engine via CoreML, BoT-SORT tracking that corrects for camera pans, identities anchored to jersey colour, and pitch calibration that turns pixels into metres. The model runs on its own thread, so playback never stutters.',
    },
    {
      label: 'Impact',
      text: 'Runs in real time on 50fps broadcast footage on a MacBook. Skipped frames fell from 64% to about 1%, overlapping players keep their IDs, and pass detection found 8 of 9 hand-labelled passes without inventing any.',
    },
  ],
};

const FEATURED_DEVELOPER = {
  title: PROJECT_KICKTRACK.title,
  tagline: 'the one that actually fought back',
  metrics: [
    { value: '64% → 1%', label: 'frames skipped at 50fps' },
    { value: '3 → 19/19', label: 'overlap frames, IDs held' },
    { value: '8/9, 0 fake', label: 'passes, hand-labelled clip' },
  ],
  sections: [
    {
      label: 'What I tried',
      text: 'ByteTrack, because it\'s fast and simple. The broadcast footage pans and zooms a little, and IoU-only matching handed out a new player ID almost every frame. Moved to BoT-SORT for camera-motion compensation.',
    },
    {
      label: 'What broke',
      text: 'IDs still swapped with no lost track: the detector returned one box over two overlapping players, and when it shrank back the ID landed on the wrong body. A goalkeeper\'s ID walked off with a defender.',
    },
    {
      label: 'What I learned',
      text: 'Verify visually, not just by counters. Every smaller, faster model "passed" the benchmarks while missing real players. The fix was keeping full resolution on the Neural Engine, anchoring identity to jersey colour and switching to YOLO26s, checked frame by frame.',
    },
  ],
};

interface EarlierProject {
  title: string;
  slug: string;
  confidence: number;
  summary: string;
  tried: string;
  broke: string;
  learned: string;
  githubLink: string;
  demoUrl?: string;
  stack: string[];
}

const EARLIER_PROJECTS: EarlierProject[] = [
  {
    title: PROJECT_BOOKSTORE.title,
    slug: 'bookstore',
    confidence: 0.88,
    summary: 'Angular search UI over the Google Books API: search by title, author or keyword, with detail views. No backend.',
    tried: 'Wanted infinite scroll, offline caching, and a custom debounce hook — for a book search page.',
    broke: 'Nothing broke, but I spent 3 days on things no user would notice.',
    learned: 'Sometimes a simple input + button is the product. Shipped a fast, usable app. Live demo still runs.',
    githubLink: PROJECT_BOOKSTORE.githubUrl,
    demoUrl: PROJECT_BOOKSTORE.demoUrl,
    stack: ['Angular', 'TypeScript', 'Bootstrap'],
  },
  {
    title: PROJECT_ECOMMERCE.title,
    slug: 'ecommerce',
    confidence: 0.94,
    summary: 'Full-stack shop: Spring Boot REST API, Angular SPA and PostgreSQL, with JWT auth and a layered service/repository design.',
    tried: 'Started with a custom auth system with refresh token rotation and per-device sessions. Very elegant. Very overengineered.',
    broke: 'Broke in staging when two concurrent requests hit the token refresh endpoint. Race condition.',
    learned: 'Boring code is good code. Simplified to standard JWT + stateless. Shipped. Never thought about it again.',
    githubLink: PROJECT_ECOMMERCE.githubUrl,
    stack: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL'],
  },
  {
    title: PROJECT_ESTORE.title,
    slug: 'estore',
    confidence: 0.91,
    summary: 'MERN app built to learn the stack end to end: React UI, Node/Express APIs, MongoDB with Mongoose, auth and sessions.',
    tried: 'MongoDB because "schemaless = flexible." Designed the product documents to hold everything: reviews, variants, stock.',
    broke: 'Querying nested arrays for specific review authors became an aggregation pipeline nightmare.',
    learned: 'Schema-less doesn\'t mean schema-free. Design your documents for how you read, not how you write.',
    githubLink: PROJECT_ESTORE.githubUrl,
    stack: ['React', 'Node', 'Express', 'MongoDB'],
  },
];

export const ProjectSection = ({ viewerType }: ProjectSectionProps) => {
  const { accent } = useViewer();
  const isRecruiter = viewerType === 'recruiter';

  const handleCodeView = (projectName: string) => {
    event('Code views', { category: 'Portfolio', label: projectName, value: 1 });
  };

  const handleDemoClick = (title: string) => {
    event('demo_viewed', { category: 'Portfolio', label: title, value: 1 });
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
          }}
          className="mb-8 mt-16 flex flex-wrap items-center justify-between gap-2"
        >
          <span>{isRecruiter ? 'Earlier projects · learning builds' : '// earlier, simpler times'}</span>
          <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
            tracking {EARLIER_PROJECTS.length} objects
          </span>
        </p>

        <TrackedList
          key={`list-${viewerType}`}
          projects={EARLIER_PROJECTS}
          isRecruiter={isRecruiter}
          accent={accent}
          onCodeView={handleCodeView}
          onDemoClick={handleDemoClick}
        />
      </div>

    </>
  );
};

// ── sub-components ────────────────────────────────────────────────────────────

interface DemoVideo {
  src: string;
  poster: string;
  title: string;
}

async function fetchDemoVideos(): Promise<DemoVideo[]> {
  const base = PROJECT_KICKTRACK.demosBaseUrl;
  const res = await fetch(`${base}/list.json`);
  if (!res.ok) throw new Error(`demos list ${res.status}`);
  const list = (await res.json()) as { name: string; title: string }[];
  return list.map(({ name, title }) => ({
    src: `${base}/${name}.mp4`,
    poster: `${base}/${name}.jpg`,
    title,
  }));
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

// Overlays sit on dark match footage, so they stay dark in both colour modes (like the terminal)
const OVERLAY_TEXT = 'rgba(255,255,255,0.92)';
const OVERLAY_BG = 'rgba(0,0,0,0.55)';

function DemoPlayer({
  title,
  accent,
  onAllFailed,
}: {
  title: string;
  accent: string;
  onAllFailed: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [demos, setDemos] = useState<DemoVideo[] | null>(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playable = demos?.map((_, i) => i).filter((i) => !failed.has(i)) ?? [];
  const current = demos?.[active];
  const label = current?.title ?? '';
  const progress = time.duration ? (time.current / time.duration) * 100 : 0;

  useEffect(() => {
    fetchDemoVideos()
      .then((videos) => (videos.length ? setDemos(videos) : onAllFailed()))
      .catch(onAllFailed);
  }, [onAllFailed]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setUserPaused(true);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    if (stageRef.current) observer.observe(stageRef.current);
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      observer.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  // Play only while on screen, unless the visitor paused it themselves
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !userPaused) video.play().catch(() => {});
    else video.pause();
  }, [inView, userPaused, current]);

  const selectClip = (i: number) => {
    setActive(i);
    setTime({ current: 0, duration: 0 });
    setUserPaused(false);
    event('demo_clip_selected', { category: 'Portfolio', label: demos?.[i].title });
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    } else {
      setUserPaused(true);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    event('demo_fullscreen', { category: 'Portfolio', label });
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    // iOS Safari can only put the <video> itself into fullscreen
    if (stageRef.current?.requestFullscreen) stageRef.current.requestFullscreen();
    else video?.webkitEnterFullscreen?.();
  };

  const handleEnded = () => {
    const next = playable[(playable.indexOf(active) + 1) % playable.length];
    setActive(next);
    setTime({ current: 0, duration: 0 });
  };

  const handleError = () => {
    const next = new Set(failed).add(active);
    setFailed(next);
    const fallback = demos?.findIndex((_, i) => !next.has(i)) ?? -1;
    if (fallback === -1) onAllFailed();
    else setActive(fallback);
  };

  const iconButton = {
    width: '2rem',
    height: '2rem',
    color: OVERLAY_TEXT,
    borderRadius: '6px',
  };

  return (
    <div className="min-w-0">
      <div
        ref={stageRef}
        className="group relative overflow-hidden"
        style={{
          borderRadius: isFullscreen ? 0 : '12px',
          border: isFullscreen ? 'none' : '1px solid var(--border-2)',
          background: isFullscreen ? 'black' : 'var(--bg-surface)',
          aspectRatio: '16 / 9',
        }}
      >
        {current ? (
          <video
            ref={videoRef}
            key={current.src}
            src={current.src}
            poster={current.poster}
            muted
            playsInline
            loop={playable.length === 1}
            preload={inView ? 'auto' : 'none'}
            onClick={togglePlay}
            onDoubleClick={toggleFullscreen}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => setTime({ current: 0, duration: e.currentTarget.duration })}
            onTimeUpdate={(e) =>
              setTime({ current: e.currentTarget.currentTime, duration: e.currentTarget.duration })
            }
            onEnded={handleEnded}
            onError={handleError}
            aria-label={`${title} demo: live player tracking on ${label} match footage`}
            className="h-full w-full cursor-pointer"
            style={{ objectFit: isFullscreen ? 'contain' : 'cover', display: 'block' }}
          />
        ) : (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'var(--bg-input)' }} />
        )}

        {current && (
          <>
            {!playing && (
              <button
                onClick={togglePlay}
                aria-label="Play demo"
                className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-105"
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: OVERLAY_BG,
                  backdropFilter: 'blur(6px)',
                  border: `1px solid ${accent}`,
                  color: accent,
                }}
              >
                <Play size={22} fill="currentColor" style={{ marginLeft: '3px' }} />
              </button>
            )}

            <div
              className={`absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 pb-2 pt-8 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${
                playing ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}
            >
              <button
                onClick={togglePlay}
                aria-label={playing ? 'Pause demo' : 'Play demo'}
                className="flex shrink-0 items-center justify-center hover:bg-white/10"
                style={iconButton}
              >
                {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </button>
              <input
                type="range"
                min={0}
                max={time.duration || 0}
                step={0.1}
                value={time.current}
                onChange={(e) => {
                  const t = Number(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = t;
                  setTime((prev) => ({ ...prev, current: t }));
                }}
                aria-label="Seek"
                className="h-1 min-w-0 flex-1 cursor-pointer"
                style={{ accentColor: accent }}
              />
              <span
                className="shrink-0 tabular-nums"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.7rem',
                  color: OVERLAY_TEXT,
                }}
              >
                {formatTime(time.current)} / {formatTime(time.duration)}
              </span>
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
                className="flex shrink-0 items-center justify-center hover:bg-white/10"
                style={iconButton}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </>
        )}
      </div>

      {demos && playable.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Demo clips">
          {demos.map((video, i) =>
            failed.has(i) ? null : (
              <button
                key={video.src}
                role="tab"
                aria-selected={i === active}
                aria-label={`Play ${video.title} clip`}
                onClick={() => selectClip(i)}
                className={`relative shrink-0 overflow-hidden transition-opacity ${
                  i === active ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                }`}
                style={{
                  width: '8.5rem',
                  aspectRatio: '16 / 9',
                  borderRadius: '8px',
                  border: `2px solid ${i === active ? accent : 'var(--border-2)'}`,
                  background: 'var(--bg-surface)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={video.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                <span
                  className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.62rem',
                    color: OVERLAY_TEXT,
                    background: OVERLAY_BG,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                  }}
                >
                  {i === active && playing && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
                  )}
                  {video.title}
                </span>
                {i === active && (
                  <span
                    className="absolute bottom-0 left-0"
                    style={{
                      height: '3px',
                      width: `${progress}%`,
                      background: accent,
                      transition: 'width 0.25s linear',
                    }}
                  />
                )}
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
  const mono = 'var(--font-jetbrains-mono), monospace';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: 'clamp(1.25rem, 4vw, 2rem)',
      }}
    >
      <BoundingBox accent={accent} label="#04 kicktrack 0.99" radius={16} />
      <div className={`grid gap-8 ${videoFailed ? '' : 'lg:grid-cols-[1.65fr_1fr]'}`}>
        {!videoFailed && <DemoPlayer title={project.title} accent={accent} onAllFailed={hideVideo} />}

        <div className="flex flex-col">
          <span
            style={{
              fontFamily: mono,
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
              fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginTop: '0.4rem',
            }}
          >
            {project.title}
          </h3>
          <p style={{ color: 'var(--fg-3)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            {project.tagline}
          </p>

          <dl className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {project.metrics.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col-reverse"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-2)',
                  borderLeft: `3px solid ${accent}`,
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                }}
              >
                <dt style={{ color: 'var(--fg-4)', fontSize: '0.75rem' }}>{label}</dt>
                <dd
                  style={{
                    fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
                    color: 'var(--fg)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mb-6 flex flex-wrap gap-1.5">
            {FEATURED_STACK.map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: mono,
                  fontSize: '0.7rem',
                  color: 'var(--fg-3)',
                  border: '1px solid var(--border-2)',
                  borderRadius: '999px',
                  padding: '0.2rem 0.65rem',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            <motion.a
              href={PROJECT_KICKTRACK.writeupUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => event('writeup_view', { category: 'Portfolio', label: project.title })}
              className="inline-flex items-center gap-2"
              style={{
                color: 'var(--bg)',
                background: accent,
                border: `1px solid ${accent}`,
                borderRadius: '8px',
                padding: '0.55rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              whileHover={{ y: -2 }}
            >
              Read how it works <ArrowRight size={14} />
            </motion.a>
            {PROJECT_KICKTRACK.repoPublic ? (
              <motion.a
                href={PROJECT_KICKTRACK.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onCodeView}
                className="inline-flex items-center gap-2"
                style={{
                  color: accent,
                  border: `1px solid ${accent}55`,
                  borderRadius: '8px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                whileHover={{ y: -2 }}
              >
                <Github size={16} /> Code <ExternalLink size={14} />
              </motion.a>
            ) : (
              <span style={{ color: 'var(--fg-4)', fontSize: '0.875rem', alignSelf: 'center' }}>Code going public soon</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 pt-6 md:grid-cols-3" style={{ borderTop: '1px solid var(--border-2)' }}>
        {project.sections.map(({ label, text }, i) => (
          <div key={label}>
            <span
              style={{
                fontFamily: mono,
                color: labelColors[i],
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              {label}
            </span>
            <p style={{ color: 'var(--fg-2)', fontSize: '0.875rem', lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Computer-vision style bounding box, echoing KickTrack's player-tracking overlay
function BoundingBox({ accent, label, radius = 6 }: { accent: string; label: string; radius?: number }) {
  const edge = `2px solid ${accent}`;
  const corners: CSSProperties[] = [
    { top: -1, left: -1, borderTop: edge, borderLeft: edge, borderTopLeftRadius: radius },
    { top: -1, right: -1, borderTop: edge, borderRight: edge, borderTopRightRadius: radius },
    { bottom: -1, left: -1, borderBottom: edge, borderLeft: edge, borderBottomLeftRadius: radius },
    { bottom: -1, right: -1, borderBottom: edge, borderRight: edge, borderBottomRightRadius: radius },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ border: `1px solid ${accent}33`, borderRadius: radius }}
    >
      {corners.map((style, i) => (
        <span key={i} className="absolute" style={{ width: 16, height: 16, ...style }} />
      ))}
      <span
        className="absolute whitespace-nowrap tabular-nums"
        style={{
          bottom: '100%',
          left: radius > 8 ? radius : -1,
          background: accent,
          color: 'var(--bg)',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '0.65rem',
          fontWeight: 600,
          padding: '0.1rem 0.45rem',
          borderRadius: '4px 4px 0 0',
        }}
      >
        {label}
      </span>
    </div>
  );
}

const jitterPx = () => (Math.random() - 0.5) * 3;

function TrackedList({
  projects,
  isRecruiter,
  accent,
  onCodeView,
  onDemoClick,
}: {
  projects: EarlierProject[];
  isRecruiter: boolean;
  accent: string;
  onCodeView: (title: string) => void;
  onDemoClick: (title: string) => void;
}) {
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [jitter, setJitter] = useState({ x: 0, y: 0, conf: 0 });
  const target = active === null ? null : projects[active];

  // Follow the active row, re-measuring when it resizes (developer rows expand)
  useEffect(() => {
    const row = rows.current[active ?? 0];
    if (!row) return;
    const measure = () =>
      setRect({ top: row.offsetTop, left: row.offsetLeft, width: row.offsetWidth, height: row.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [active]);

  // No hover on touch screens: track whichever row is in the middle of the viewport
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  // Live-inference feel: the box wobbles and the confidence flickers
  useEffect(() => {
    if (active === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(
      () => setJitter({ x: jitterPx(), y: jitterPx(), conf: Math.round(Math.random() * 2 - 1) / 100 }),
      180,
    );
    return () => clearInterval(id);
  }, [active]);

  return (
    <ul
      className="relative flex flex-col gap-2"
      onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
    >
      <motion.div
        className="pointer-events-none absolute"
        initial={false}
        animate={{
          top: rect.top + jitter.y,
          left: rect.left + jitter.x,
          width: rect.width,
          height: rect.height,
          opacity: target ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, opacity: { duration: 0.2 } }}
      >
        {target && (
          <BoundingBox
            accent={accent}
            label={`#${String(active! + 1).padStart(2, '0')} ${target.slug} ${(target.confidence + jitter.conf).toFixed(2)}`}
          />
        )}
      </motion.div>

      {projects.map((project, i) => (
        <ArchiveRow
          key={project.title}
          project={project}
          index={i}
          isRecruiter={isRecruiter}
          accent={accent}
          rowRef={(el) => {
            rows.current[i] = el;
          }}
          onPointerEnter={() => setActive(i)}
          onCodeView={() => onCodeView(project.title)}
          onDemoClick={() => onDemoClick(project.title)}
        />
      ))}
    </ul>
  );
}

function ArchiveRow({
  project,
  index,
  isRecruiter,
  accent,
  rowRef,
  onPointerEnter,
  onCodeView,
  onDemoClick,
}: {
  project: EarlierProject;
  index: number;
  rowRef: (el: HTMLLIElement | null) => void;
  onPointerEnter: () => void;
  isRecruiter: boolean;
  accent: string;
  onCodeView: () => void;
  onDemoClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const mono = 'var(--font-jetbrains-mono), monospace';
  const detailsId = `project-details-${index}`;
  // The whole row opens the live demo when there is one, otherwise the code
  const primary = project.demoUrl
    ? { href: project.demoUrl, onClick: onDemoClick, label: 'live demo' }
    : { href: project.githubLink, onClick: onCodeView, label: 'code on GitHub' };

  return (
    <motion.li
      ref={rowRef}
      data-index={index}
      onPointerEnter={onPointerEnter}
      onFocus={onPointerEnter}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative px-4 py-5 sm:px-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1">
          <h3
            style={{
              fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
              color: 'var(--fg)',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={primary.onClick}
              aria-label={`${project.title}: open ${primary.label}`}
              className="inline-flex items-center gap-1.5 outline-none after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:after:outline-dashed focus-visible:after:outline-1"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {project.title}
              <ArrowUpRight
                size={16}
                className="opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: accent }}
              />
            </a>
          </h3>
          <p style={{ color: 'var(--fg-3)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '0.2rem' }}>
            {isRecruiter ? project.summary : project.learned}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {project.stack.map((tech) => (
              <span key={tech} style={{ fontFamily: mono, fontSize: '0.7rem', color: 'var(--fg-4)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-4" style={{ fontSize: '0.8rem' }}>
          {!isRecruiter && (
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={detailsId}
              className="inline-flex items-center gap-1"
              style={{ fontFamily: mono, color: 'var(--fg-3)' }}
            >
              {open ? 'less' : 'what happened'}
              <ChevronDown
                size={14}
                style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </button>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDemoClick}
              className="inline-flex items-center gap-1 transition-colors hover:text-[var(--fg)]"
              style={{ color: 'var(--fg-3)', textDecoration: 'none' }}
            >
              Demo <ExternalLink size={12} />
            </a>
          )}
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCodeView}
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: accent, textDecoration: 'none' }}
          >
            Code <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={detailsId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 overflow-hidden"
          >
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'What I tried', text: project.tried, color: accent },
                { label: 'What broke', text: project.broke, color: 'var(--color-danger)' },
              ].map(({ label, text, color }) => (
                <div key={label} style={{ borderLeft: `2px solid ${color}`, paddingLeft: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: mono,
                      color,
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {label}
                  </span>
                  <p style={{ color: 'var(--fg-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default ProjectSection;
