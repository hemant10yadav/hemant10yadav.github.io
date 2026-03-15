'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewer } from '../context/ViewerContext';

import { GITHUB_USERNAME, GITHUB_URL } from '../constants';
const GITHUB_USER = GITHUB_USERNAME;
const CACHE_KEY = 'hy_gh_activity';
const CACHE_TTL = 5 * 60 * 1000; // 5 min

interface ActivityData {
  repoName: string;       // "hemant10yadav/some-repo"
  timeAgo: string;        // "3h ago"
  eventType: string;      // "PushEvent"
  fetchedAt: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function shortRepo(fullName: string): string {
  return fullName.replace(`${GITHUB_USER}/`, '');
}

// ── component ─────────────────────────────────────────────────────────────────

export default function GitHubActivity() {
  const { viewerType, accent } = useViewer();
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [visible, setVisible] = useState(false);

  const isRecruiter = viewerType === 'recruiter';

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Check sessionStorage cache first
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: ActivityData = JSON.parse(cached);
          if (Date.now() - parsed.fetchedAt < CACHE_TTL) {
            if (!cancelled) { setActivity(parsed); setVisible(true); }
            return;
          }
        }
      } catch { /* ignore */ }

      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=10`,
          { signal: AbortSignal.timeout(5000) },
        );
        if (!res.ok) return;

        const events: Array<{ type: string; repo: { name: string }; created_at: string }> =
          await res.json();

        // Prefer PushEvent; fallback to first event
        const push = events.find((e) => e.type === 'PushEvent') ?? events[0];
        if (!push) return;

        const data: ActivityData = {
          repoName: push.repo.name,
          timeAgo: timeAgo(push.created_at),
          eventType: push.type,
          fetchedAt: Date.now(),
        };

        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* ignore */ }

        if (!cancelled) { setActivity(data); setVisible(true); }
      } catch { /* network error or rate limit — stay hidden */ }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  if (!activity) return null;

  const label = isRecruiter
    ? `Actively building · ${activity.timeAgo}`
    : `pushed to ${shortRepo(activity.repoName)} · ${activity.timeAgo}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: 1 }}
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '2rem',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '999px',
            maxWidth: 'calc(100vw - 2rem)',
            background: 'var(--bg-overlay)',
            border: `1px solid ${accent}30`,
            backdropFilter: 'blur(10px)',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accent}70`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accent}30`;
          }}
        >
          {/* Pulsing dot */}
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                position: 'absolute',
                width: '0.55rem',
                height: '0.55rem',
                borderRadius: '50%',
                background: accent,
                opacity: 0.3,
                animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            <span
              style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                background: accent,
                display: 'block',
                position: 'relative',
              }}
            />
          </span>

          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.7rem',
              color: 'var(--fg-2)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {label}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
