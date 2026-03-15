'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewer } from '../context/ViewerContext';
import { RefreshCw } from 'lucide-react';

// ── types ────────────────────────────────────────────────────────────────────

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants: number;
  by: string;
}

interface TrendingRepo {
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  url: string;
}

interface NpmPackage {
  name: string;
  downloads: number;
  previousDownloads: number;
  growth: number;
}

interface PulseData {
  hn: HNStory[];
  repos: TrendingRepo[];
  npm: NpmPackage[];
  temperature: number;
  fetchedAt: number;
}

const CACHE_KEY = 'hy_pulse_data';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ── data fetchers ────────────────────────────────────────────────────────────

async function fetchHNStories(): Promise<HNStory[]> {
  const res = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json',
    { signal: AbortSignal.timeout(8000) },
  );
  const ids: number[] = await res.json();
  const top = ids.slice(0, 5);
  const stories = await Promise.all(
    top.map(async (id) => {
      const r = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        { signal: AbortSignal.timeout(5000) },
      );
      return r.json() as Promise<HNStory>;
    }),
  );
  return stories;
}

async function fetchGitHubTrending(): Promise<TrendingRepo[]> {
  // Use GitHub search API as a proxy for trending — repos created recently with most stars
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const dateStr = date.toISOString().split('T')[0];
  const res = await fetch(
    `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=5`,
    { signal: AbortSignal.timeout(8000) },
  );
  const data = await res.json();
  return (data.items || []).slice(0, 5).map(
    (r: { name: string; full_name: string; description: string; language: string; stargazers_count: number; html_url: string }) => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description || '',
      language: r.language || 'Unknown',
      stars: r.stargazers_count,
      url: r.html_url,
    }),
  );
}

// Well-known npm packages to check for trending activity
const NPM_PACKAGES = [
  'react', 'next', 'vite', 'typescript', 'tailwindcss',
  'bun', 'esbuild', 'astro', 'svelte', 'hono',
  'drizzle-orm', 'zod', 'trpc', 'shadcn-ui', 'prisma',
];

async function fetchNpmStats(): Promise<NpmPackage[]> {
  const now = new Date();
  const lastWeekEnd = new Date(now);
  lastWeekEnd.setDate(now.getDate() - 1);
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 7);
  const prevWeekEnd = new Date(now);
  prevWeekEnd.setDate(now.getDate() - 8);
  const prevWeekStart = new Date(now);
  prevWeekStart.setDate(now.getDate() - 14);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const results = await Promise.all(
    NPM_PACKAGES.map(async (pkg) => {
      try {
        const [currRes, prevRes] = await Promise.all([
          fetch(
            `https://api.npmjs.org/downloads/point/${fmt(lastWeekStart)}:${fmt(lastWeekEnd)}/${pkg}`,
            { signal: AbortSignal.timeout(5000) },
          ),
          fetch(
            `https://api.npmjs.org/downloads/point/${fmt(prevWeekStart)}:${fmt(prevWeekEnd)}/${pkg}`,
            { signal: AbortSignal.timeout(5000) },
          ),
        ]);
        const curr = await currRes.json();
        const prev = await prevRes.json();
        const currentDl = curr.downloads || 0;
        const previousDl = prev.downloads || 0;
        const growth = previousDl > 0 ? ((currentDl - previousDl) / previousDl) * 100 : 0;
        return { name: pkg, downloads: currentDl, previousDownloads: previousDl, growth };
      } catch {
        return null;
      }
    }),
  );

  return (results.filter(Boolean) as NpmPackage[])
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 5);
}

function calculateTemperature(stories: HNStory[]): number {
  if (!stories.length) return 5;
  const avgScore = stories.reduce((s, st) => s + st.score, 0) / stories.length;
  const avgComments = stories.reduce((s, st) => s + (st.descendants || 0), 0) / stories.length;
  // Normalize: top HN stories avg ~300-800 points, 100-400 comments
  const scoreTemp = Math.min(avgScore / 600, 1) * 5;
  const commentTemp = Math.min(avgComments / 300, 1) * 5;
  return Math.max(1, Math.min(10, Math.round((scoreTemp + commentTemp) * 10) / 10));
}

// ── skeleton components ──────────────────────────────────────────────────────

function SkeletonLine({ width = '100%', height = '0.75rem' }: { width?: string; height?: string }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: '4px',
        background: 'rgba(255,255,255,0.06)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}

function SkeletonCard({ lines = 5 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
      <SkeletonLine width="40%" height="0.85rem" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <SkeletonLine width="1.2rem" height="1.2rem" />
          <SkeletonLine width={`${60 + Math.random() * 30}%`} />
        </div>
      ))}
    </div>
  );
}

// ── temperature gauge ────────────────────────────────────────────────────────

function TemperatureGauge({ value, accent }: { value: number; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 2000;
    const from = 0;
    const to = value;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Dramatic ease-out-back
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = (size * 0.65) * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size * 0.65}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size * 0.58;
    const radius = size * 0.38;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    ctx.clearRect(0, 0, size, size * 0.65);

    // Track background
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (i / 10) * Math.PI;
      const innerR = radius - 14;
      const outerR = radius - 8;
      ctx.beginPath();
      ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
      ctx.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.strokeStyle = i <= animatedValue ? `${accent}90` : 'rgba(255,255,255,0.1)';
      ctx.stroke();
    }

    // Active arc
    const fillAngle = startAngle + (animatedValue / 10) * Math.PI;
    if (animatedValue > 0) {
      const gradient = ctx.createLinearGradient(
        cx - radius, cy, cx + radius, cy,
      );
      gradient.addColorStop(0, `${accent}40`);
      gradient.addColorStop(0.5, accent);
      gradient.addColorStop(1, animatedValue > 7 ? '#ef4444' : accent);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, fillAngle);
      ctx.lineWidth = 8;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glow effect
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, fillAngle);
      ctx.lineWidth = 16;
      ctx.strokeStyle = `${accent}18`;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Needle dot
      const dotX = cx + radius * Math.cos(fillAngle);
      const dotY = cy + radius * Math.sin(fillAngle);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
      ctx.fillStyle = `${accent}30`;
      ctx.fill();
    }

    // Center value
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 28px var(--font-jetbrains-mono), monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(animatedValue.toFixed(1), cx, cy - 2);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-jetbrains-mono), monospace';
    ctx.fillText('TECH TEMPERATURE', cx, cy + 14);
  }, [animatedValue, accent]);

  const label = animatedValue < 3 ? 'Quiet day' : animatedValue < 5 ? 'Steady' : animatedValue < 7 ? 'Buzzing' : animatedValue < 9 ? 'On fire' : 'Erupting';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <canvas ref={canvasRef} />
      <motion.span
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '0.7rem',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          color: accent,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </motion.span>
    </div>
  );
}

// ── card wrapper ─────────────────────────────────────────────────────────────

function PulseCard({
  title,
  icon,
  accent,
  children,
  delay = 0,
}: {
  title: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
      }}
      whileHover={{
        borderColor: `${accent}30`,
      }}
    >
      {/* Scanline effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.008) 2px,
            rgba(255,255,255,0.008) 4px
          )`,
          pointerEvents: 'none',
        }}
      />
      {/* Card header */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>{icon}</span>
        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: accent,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>
      {/* Card content */}
      <div style={{ padding: '1rem 1.25rem', position: 'relative' }}>{children}</div>
    </motion.div>
  );
}

// ── main Pulse component ─────────────────────────────────────────────────────

export default function Pulse() {
  const { viewerType } = useViewer();
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRecruiter = viewerType === 'recruiter';
  const accent = isRecruiter ? '#6ee7b7' : '#22d3ee';

  const fetchData = useCallback(async (force = false) => {
    // Check cache
    if (!force) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: PulseData = JSON.parse(cached);
          if (Date.now() - parsed.fetchedAt < CACHE_TTL) {
            setData(parsed);
            setLoading(false);
            return;
          }
        }
      } catch { /* ignore */ }
    }

    setLoading(!data);
    setRefreshing(!!data);

    try {
      const [hn, repos, npm] = await Promise.all([
        fetchHNStories().catch(() => [] as HNStory[]),
        fetchGitHubTrending().catch(() => [] as TrendingRepo[]),
        fetchNpmStats().catch(() => [] as NpmPackage[]),
      ]);

      const temperature = calculateTemperature(hn);

      const pulseData: PulseData = { hn, repos, npm, temperature, fetchedAt: Date.now() };
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(pulseData)); } catch { /* ignore */ }
      setData(pulseData);
    } catch { /* all failed — keep stale data if available */ }

    setLoading(false);
    setRefreshing(false);
  }, [data]);

  useEffect(() => { fetchData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const timeLabel = data
    ? new Date(data.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <section
      id="pulse"
      style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '4rem 1.5rem 2rem',
        position: 'relative',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '60%',
          background: `radial-gradient(ellipse at center, ${accent}06 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Live dot */}
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                position: 'absolute',
                width: '0.6rem',
                height: '0.6rem',
                borderRadius: '50%',
                background: accent,
                opacity: 0.4,
                animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            <span
              style={{
                width: '0.55rem',
                height: '0.55rem',
                borderRadius: '50%',
                background: accent,
                display: 'block',
                position: 'relative',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />
          </span>

          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#e2e8f0',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Pulse
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
            Live Feed
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {data && (
            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                color: '#475569',
              }}
            >
              Updated {timeLabel}
            </span>
          )}
          <motion.button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#64748b',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = accent;
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}40`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <RefreshCw
              size={14}
              style={{
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Grid layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isRecruiter ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* ── Hacker News ── */}
        <PulseCard title="Hacker News" icon="🔥" accent={accent} delay={0}>
          <AnimatePresence mode="wait">
            {loading ? (
              <SkeletonCard key="skel" />
            ) : (
              <motion.div
                key="data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
              >
                {(data?.hn || []).map((story, i) => (
                  <motion.a
                    key={story.id}
                    href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      alignItems: 'flex-start',
                      textDecoration: 'none',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.65rem',
                        color: accent,
                        minWidth: '1.3rem',
                        textAlign: 'right',
                        lineHeight: '1.4',
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#e2e8f0',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {story.title}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.6rem',
                          marginTop: '0.2rem',
                          fontSize: '0.6rem',
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          color: '#475569',
                        }}
                      >
                        <span>▲ {formatNum(story.score)}</span>
                        <span>💬 {story.descendants || 0}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </PulseCard>

        {/* ── GitHub Trending ── */}
        <PulseCard title="GitHub Trending" icon="⭐" accent={accent} delay={0.1}>
          <AnimatePresence mode="wait">
            {loading ? (
              <SkeletonCard key="skel" />
            ) : (
              <motion.div
                key="data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
              >
                {(data?.repos || []).map((repo, i) => (
                  <motion.a
                    key={repo.fullName}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      alignItems: 'flex-start',
                      textDecoration: 'none',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.65rem',
                        color: accent,
                        minWidth: '1.3rem',
                        textAlign: 'right',
                        lineHeight: '1.4',
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#e2e8f0',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {repo.fullName}
                      </div>
                      <div
                        style={{
                          fontSize: '0.6rem',
                          color: '#64748b',
                          marginTop: '0.15rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {repo.description}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.6rem',
                          marginTop: '0.2rem',
                          fontSize: '0.6rem',
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          color: '#475569',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <span
                            style={{
                              width: '0.45rem',
                              height: '0.45rem',
                              borderRadius: '50%',
                              background: langColor(repo.language),
                              display: 'inline-block',
                            }}
                          />
                          {repo.language}
                        </span>
                        <span>★ {formatNum(repo.stars)}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </PulseCard>

        {/* ── npm Trending (developer only) ── */}
        {!isRecruiter && (
          <PulseCard title="npm Trending" icon="📦" accent={accent} delay={0.2}>
            <AnimatePresence mode="wait">
              {loading ? (
                <SkeletonCard key="skel" />
              ) : (
                <motion.div
                  key="data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
                >
                  {(data?.npm || []).map((pkg, i) => (
                    <motion.a
                      key={pkg.name}
                      href={`https://www.npmjs.com/package/${pkg.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      style={{
                        display: 'flex',
                        gap: '0.6rem',
                        alignItems: 'center',
                        textDecoration: 'none',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '6px',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          fontSize: '0.65rem',
                          color: accent,
                          minWidth: '1.3rem',
                          textAlign: 'right',
                          fontWeight: 600,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: '#e2e8f0',
                            fontFamily: 'var(--font-jetbrains-mono), monospace',
                          }}
                        >
                          {pkg.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.6rem',
                            marginTop: '0.15rem',
                            fontSize: '0.6rem',
                            fontFamily: 'var(--font-jetbrains-mono), monospace',
                            color: '#475569',
                          }}
                        >
                          <span>↓ {formatNum(pkg.downloads)}/wk</span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          fontWeight: 600,
                          color: pkg.growth > 0 ? '#22c55e' : pkg.growth < 0 ? '#ef4444' : '#64748b',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {pkg.growth > 0 ? '↑' : pkg.growth < 0 ? '↓' : '→'}{' '}
                        {Math.abs(pkg.growth).toFixed(1)}%
                      </span>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </PulseCard>
        )}

        {/* ── Tech Temperature (developer only) ── */}
        {!isRecruiter && (
          <PulseCard title="Tech Temperature" icon="🌡️" accent={accent} delay={0.3}>
            <AnimatePresence mode="wait">
              {loading ? (
                <div key="skel" style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
                  <div
                    style={{
                      width: '200px',
                      height: '130px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                </div>
              ) : (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}
                >
                  <TemperatureGauge value={data?.temperature || 5} accent={accent} />
                </motion.div>
              )}
            </AnimatePresence>
          </PulseCard>
        )}
      </div>
    </section>
  );
}

// ── utils ────────────────────────────────────────────────────────────────────

function langColor(lang: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Zig: '#ec915c',
    Elixir: '#6e4a7e',
    Vue: '#41b883',
    Svelte: '#ff3e00',
  };
  return colors[lang] || '#64748b';
}
