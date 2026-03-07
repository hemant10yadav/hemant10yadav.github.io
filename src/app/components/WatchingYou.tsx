'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewer } from '../context/ViewerContext';

// ── helpers ──────────────────────────────────────────────────────────────────

function parseReferrer(ref: string): string {
  if (!ref) return 'somewhere secret';
  if (ref.includes('linkedin.com')) return 'LinkedIn';
  if (ref.includes('github.com')) return 'GitHub';
  if (ref.includes('google.com')) return 'Google';
  return 'somewhere on the internet';
}

function parseBrowserAndOS(ua: string): { browser: string; os: string } {
  let browser = 'your browser';
  let os = 'your OS';

  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';

  if (ua.includes('Mac OS X')) os = 'Mac';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { browser, os };
}

// ── line reveal schedule (cumulative ms from mount) ──────────────────────────
//
// Line 1  – 0.8 s
// Line 2  – 0.8 + 1.2 = 2.0 s
// Line 3  – 2.0 + 1.0 = 3.0 s
// Line 4  – 3.0 + 1.2 = 4.2 s
// Line 5  – 4.2 + 0.8 = 5.0 s
// [pause 1.5 s → 6.5 s]
// Line 6  – 6.5 + 1.0 = 7.5 s
// Line 7  – 7.5 + 0.6 = 8.1 s
// [pause 2.0 s → 10.1 s]
// Line 8  – 10.1 + 0.8 = 10.9 s
// [pause 2.5 s → 13.4 s]
// Line 9  – 13.4 + 1.0 = 14.4 s
// Line 10 – 14.4 + 1.2 = 15.6 s
// Buttons – 15.6 + 0.8 = 16.4 s

const SCHEDULE: Array<[number, number | 'buttons']> = [
  [800, 1],
  [2000, 2],
  [3000, 3],
  [4200, 4],
  [5000, 5],
  [7500, 6],
  [8100, 7],
  [10900, 8],
  [14400, 9],
  [15600, 10],
  [16400, 'buttons'],
];

const TOTAL_LINES = 10;

// ── component ─────────────────────────────────────────────────────────────────

export default function WatchingYou() {
  const { setViewerType } = useViewer();

  // isMobile: null = not yet determined (avoids SSR mismatch)
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const [counter, setCounter] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [visitorData, setVisitorData] = useState({
    referrer: 'somewhere secret',
    time: '',
    browser: 'your browser',
    os: 'your OS',
    screenWidth: 0,
  });

  // ── initialise on client ────────────────────────────────────────────────────
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    if (!mobile) {
      const { browser, os } = parseBrowserAndOS(navigator.userAgent);
      setVisitorData({
        referrer: parseReferrer(document.referrer),
        time: new Date().toLocaleTimeString(),
        browser,
        os,
        screenWidth: window.screen.width,
      });
    }
  }, []);

  // ── counter ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;
    const id = setInterval(() => setCounter((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, [isMobile]);

  // ── line reveal schedule ────────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile === null || isMobile) return;

    for (const [delay, action] of SCHEDULE) {
      const t = setTimeout(() => {
        if (action === 'buttons') {
          setShowButtons(true);
        } else {
          setRevealedCount(action as number);
        }
      }, delay);
      timeoutsRef.current.push(t);
    }

    const skipTimer = setTimeout(() => setShowSkip(true), 3000);
    timeoutsRef.current.push(skipTimer);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isMobile]);

  // ── mobile: go straight to buttons ─────────────────────────────────────────
  useEffect(() => {
    if (isMobile === true) {
      setRevealedCount(TOTAL_LINES);
      setShowButtons(true);
    }
  }, [isMobile]);

  // ── skip intro ──────────────────────────────────────────────────────────────
  const handleSkip = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setRevealedCount(TOTAL_LINES);
    setShowButtons(true);
    setShowSkip(false);
  };

  // Avoid SSR flash — nothing is rendered until client knows screen size
  if (isMobile === null) return null;

  // ── line definitions ────────────────────────────────────────────────────────
  const lines: Array<{ text: string; color: 'normal' | 'meta' | 'blue' }> = [
    {
      text: `You've been on this page for ${counter} ${counter === 1 ? 'second' : 'seconds'}.`,
      color: 'normal',
    },
    { text: `You came from ${visitorData.referrer}.`, color: 'meta' },
    { text: `It's ${visitorData.time} where you are.`, color: 'meta' },
    { text: `You're on ${visitorData.browser} · ${visitorData.os}.`, color: 'meta' },
    { text: `Your screen is ${visitorData.screenWidth}px wide.`, color: 'meta' },
    { text: 'I already know more about you than your', color: 'blue' },
    { text: 'recruiter screening told you about me.', color: 'blue' },
    { text: 'Funny how that works.', color: 'normal' },
    { text: 'Before I show you who I am —', color: 'normal' },
    { text: 'who are you?', color: 'normal' },
  ];

  const colorMap = {
    normal: '#e2e8f0',
    meta: '#64748b',
    blue: '#38bdf8',
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' },
    }),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center items-start"
      style={{ background: '#000', padding: '0 clamp(1.5rem, 8vw, 6rem)' }}
    >
      {/* Lines */}
      {!isMobile && (
        <div className="space-y-4 w-full max-w-2xl">
          {lines.map((line, i) => (
            <AnimatePresence key={i}>
              {revealedCount > i && (
                <motion.p
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    color: colorMap[line.color],
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: 'clamp(0.9rem, 1.8vw, 1.125rem)',
                    lineHeight: 1.6,
                  }}
                >
                  {line.text}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>
      )}

      {/* Buttons */}
      <AnimatePresence>
        {showButtons && (
          <div
            className={`flex ${isMobile ? 'flex-col w-full max-w-xs mx-auto items-center justify-center h-full' : 'flex-col sm:flex-row gap-4 mt-10 max-w-2xl'}`}
            style={isMobile ? { gap: '1rem' } : {}}
          >
            {[
              { label: "I'm here to hire", type: 'recruiter' as const },
              { label: "I'm a fellow developer", type: 'developer' as const },
            ].map((btn, i) => (
              <motion.button
                key={btn.type}
                custom={i}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                onClick={() => setViewerType(btn.type)}
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  border: '1px solid rgba(226,232,240,0.3)',
                  color: '#e2e8f0',
                  background: 'transparent',
                  padding: '0.75rem 1.75rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  letterSpacing: '0.02em',
                  transition: 'all 0.25s ease',
                  width: isMobile ? '100%' : 'auto',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 0 20px rgba(226,232,240,0.25), inset 0 0 20px rgba(226,232,240,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(226,232,240,0.7)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(226,232,240,0.3)';
                }}
              >
                [ {btn.label} ]
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Skip intro */}
      <AnimatePresence>
        {showSkip && !showButtons && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = '#475569')
            }
          >
            skip intro →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
