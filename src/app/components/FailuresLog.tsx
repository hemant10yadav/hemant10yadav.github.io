'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LogEntry {
  date: string;
  level: 'INCIDENT' | 'ESTIMATE' | 'OVERENG' | 'HUBRIS' | 'REVIEW' | 'ARCH' | 'PROD' | 'DEBUG';
  message: string;
  footnote: string;
}

const ENTRIES: LogEntry[] = [
  {
    date: "2022-06-18",
    level: "INCIDENT",
    message: "Added new functionality to the editor for Android.",
    footnote:
      "Later discovered it crashes on iPhone due to a platform-specific issue.",
  },
  {
    date: "2023-03-12",
    level: "PROD",
    message: "Ran a migration that contained a logic bug.",
    footnote:
      "Corrupted table data. Had to debug and repair the data manually.",
  },
  {
    date: "2023-09-05",
    level: "DEBUG",
    message:
      "Built a feature on top of an existing one and updated logic in most places.",
    footnote: "Missed one edge case. Production broke later.",
  },
  {
    date: "2024-02-21",
    level: "HUBRIS",
    message:
      "Pushed a 'simple one-line fix' directly to production without testing.",
    footnote: "It broke the notification system.",
  },
  {
    date: "2024-07-30",
    level: "REVIEW",
    message: "Tested the feature on staging using only a superuser account.",
    footnote: "Permissions failed for normal users in production.",
  },
  {
    date: "2026-01-16",
    level: "PROD",
    message:
      "Forgot to create the PostGIS extension on the secondary database.",
    footnote: "Deployment failed when spatial queries started running.",
  },
];

const LEVEL_COLORS: Record<LogEntry['level'], string> = {
  INCIDENT: '#ef4444',
  ESTIMATE: '#f97316',
  OVERENG:  '#eab308',
  HUBRIS:   '#f97316',
  REVIEW:   '#ef4444',
  ARCH:     '#f97316',
  PROD:     '#ef4444',
  DEBUG:    '#eab308',
};

export default function FailuresLog() {
  const [visibleCount, setVisibleCount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Reveal entries one-by-one when scrolled into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          let i = 0;
          const tick = () => {
            i++;
            setVisibleCount(i);
            if (i < ENTRIES.length) setTimeout(tick, 220);
          };
          setTimeout(tick, 400);
        }
      },
      { rootMargin: '-10% 0px' },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20"
      style={{ background: '#080c14' }}
    >
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: '2rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.4rem',
            }}
          >
            <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: '0.85rem' }}>$</span>
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                color: '#475569',
                fontSize: '0.85rem',
              }}
            >
              cat ~/.mistakes/production.log
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: '#475569',
              fontSize: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            LOADING {ENTRIES.length} ENTRIES...
          </div>
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(34,211,238,0.3) 0%, transparent 60%)',
            }}
          />
        </motion.div>

        {/* Terminal window */}
        <div
          style={{
            background: '#0a0e1a',
            border: '1px solid rgba(34,211,238,0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
          }}
        >
          {/* Chrome */}
          <div
            style={{
              background: '#111827',
              padding: '0.55rem 1rem',
              borderBottom: '1px solid rgba(34,211,238,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            {['#ef4444', '#6ee7b7', '#22c55e'].map((c) => (
              <span
                key={c}
                style={{ width: '0.55rem', height: '0.55rem', borderRadius: '50%', background: c, display: 'block', opacity: 0.8 }}
              />
            ))}
            <span style={{ color: '#334155', fontSize: '0.68rem', marginLeft: '0.3rem' }}>
              production_mistakes.log
            </span>
          </div>

          {/* Log entries */}
          <div style={{ padding: 'clamp(0.75rem, 3vw, 1.25rem) clamp(0.75rem, 3vw, 1.5rem)' }}>
            {ENTRIES.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={visibleCount > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                style={{
                  marginBottom: i < ENTRIES.length - 1 ? '0.65rem' : 0,
                }}
              >
                {/* Date + Level on one line */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ color: '#334155', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>[{entry.date}]</span>
                  <span
                    style={{
                      color: LEVEL_COLORS[entry.level],
                      fontSize: '0.65rem',
                      letterSpacing: '0.06em',
                      opacity: 0.85,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.level}
                  </span>
                </div>

                {/* Message + footnote */}
                <div style={{ marginTop: '0.15rem' }}>
                  <span style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5 }}>{entry.message}</span>
                  <span style={{ color: '#475569', fontSize: '0.75rem' }}> {entry.footnote}</span>
                </div>
              </motion.div>
            ))}

            {/* EOF line */}
            {visibleCount >= ENTRIES.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ marginTop: '1.25rem' }}
              >
                <div
                  style={{
                    height: '1px',
                    background: 'rgba(34,211,238,0.07)',
                    marginBottom: '1rem',
                  }}
                />
                <p style={{ color: '#334155', fontSize: '0.72rem' }}>EOF</p>
                <p style={{ color: '#1e293b', fontSize: '0.7rem', marginTop: '0.5rem' }}>
                  {`// ${ENTRIES.length} logged. more pending review. growth in progress.`}
                </p>

                {/* Blinking cursor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem' }}>
                  <span style={{ color: '#22d3ee', fontSize: '0.82rem' }}>$</span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '0.45rem',
                      height: '0.95rem',
                      background: '#22d3ee',
                      opacity: 0.7,
                      animation: 'blink 1.1s step-end infinite',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: '#1e293b',
            fontSize: '0.7rem',
            marginTop: '1rem',
            textAlign: 'center',
          }}
        >
          {`// this is not a cry for help. this is how engineers grow.`}
        </motion.p>
      </div>
    </section>
  );
}
