'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewer } from '../context/ViewerContext';

// ── localStorage helpers (safe for private browsing) ─────────────────────────

const LS_TYPE_KEY = 'hy_viewer_type';
const LS_VISITS_KEY = 'hy_visit_count';

const lsGet = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const lsSet = (key: string, val: string) => {
  try { localStorage.setItem(key, val); } catch { /* ignore */ }
};

// ── visitor data helpers ──────────────────────────────────────────────────────

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

// ── timing schedule for new visitors (cumulative ms) ─────────────────────────

const SCHEDULE: Array<[number, number | 'buttons']> = [
  [800, 1], [2000, 2], [3000, 3], [4200, 4], [5000, 5],
  [7500, 6], [8100, 7], [10900, 8], [14400, 9], [15600, 10],
  [16400, 'buttons'],
];

// returning visitor lines animate fast
const RETURNING_SCHEDULE: Array<[number, number | 'buttons']> = [
  [400, 1], [1100, 2], [1700, 3], [2400, 'buttons'],
];

type Mode = null | 'returning' | 'new-mobile' | 'new-desktop';

const lineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const btnVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: 'easeOut' },
  }),
};

// ── component ─────────────────────────────────────────────────────────────────

export default function WatchingYou() {
  const { setViewerType } = useViewer();

  const [mode, setMode] = useState<Mode>(null);
  const [previousChoice, setPreviousChoice] = useState<'recruiter' | 'developer' | null>(null);
  const [visitCount, setVisitCount] = useState(0);

  // new-desktop state
  const [counter, setCounter] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [visitorData, setVisitorData] = useState({
    referrer: 'somewhere secret', time: '',
    browser: 'your browser', os: 'your OS', screenWidth: 0,
  });

  // ── initialise on client ──────────────────────────────────────────────────
  useEffect(() => {
    const stored = lsGet(LS_TYPE_KEY) as 'recruiter' | 'developer' | null;
    const visits = parseInt(lsGet(LS_VISITS_KEY) || '0', 10);

    if (stored) {
      setPreviousChoice(stored);
      setVisitCount(visits);
      setMode('returning');
      return;
    }

    const mobile = window.innerWidth < 768;
    if (mobile) {
      setMode('new-mobile');
      return;
    }

    const { browser, os } = parseBrowserAndOS(navigator.userAgent);
    setVisitorData({
      referrer: parseReferrer(document.referrer),
      time: new Date().toLocaleTimeString(),
      browser, os,
      screenWidth: window.screen.width,
    });
    setMode('new-desktop');
  }, []);

  // ── counter for new-desktop ───────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'new-desktop') return;
    const id = setInterval(() => setCounter((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, [mode]);

  // ── line reveal schedule ─────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'new-desktop' && mode !== 'returning') return;

    const schedule = mode === 'returning' ? RETURNING_SCHEDULE : SCHEDULE;

    for (const [delay, action] of schedule) {
      const t = setTimeout(() => {
        if (action === 'buttons') setShowButtons(true);
        else setRevealedCount(action as number);
      }, delay);
      timeoutsRef.current.push(t);
    }

    if (mode === 'new-desktop') {
      const skipTimer = setTimeout(() => setShowSkip(true), 3000);
      timeoutsRef.current.push(skipTimer);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [mode]);

  // ── mobile new visitor: buttons immediately ───────────────────────────────
  useEffect(() => {
    if (mode === 'new-mobile') {
      setRevealedCount(10);
      setShowButtons(true);
    }
  }, [mode]);

  const handleSkip = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setRevealedCount(10);
    setShowButtons(true);
    setShowSkip(false);
  };

  const handleChoice = (type: 'recruiter' | 'developer') => {
    const visits = parseInt(lsGet(LS_VISITS_KEY) || '0', 10);
    lsSet(LS_TYPE_KEY, type);
    lsSet(LS_VISITS_KEY, String(visits + 1));
    setViewerType(type);
  };

  if (mode === null) return null;

  // ── line definitions for new-desktop ─────────────────────────────────────
  const newVisitorLines: Array<{ text: string; color: 'normal' | 'meta' | 'blue' }> = [
    { text: `You've been on this page for ${counter} ${counter === 1 ? 'second' : 'seconds'}.`, color: 'normal' },
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

  // ── line definitions for returning visitor ────────────────────────────────
  const otherChoice = previousChoice === 'recruiter' ? 'developer' : 'recruiter';
  const returningLines: Array<{ text: string; color: 'normal' | 'meta' | 'blue' }> = [
    { text: "You're back.", color: 'normal' },
    {
      text: `Last time you were here as a ${previousChoice}${visitCount > 1 ? ` (visit #${visitCount})` : ''}.`,
      color: 'blue',
    },
    { text: 'Changed your mind?', color: 'normal' },
  ];

  const colorMap = { normal: '#e2e8f0', meta: '#64748b', blue: '#38bdf8' };

  const activeLinesForMode =
    mode === 'returning' ? returningLines : newVisitorLines;

  const IdentityButtons = () => (
    <AnimatePresence>
      {showButtons && (
        <div
          style={{
            display: 'flex',
            flexDirection: mode === 'new-mobile' ? 'column' : 'row',
            gap: '1rem',
            marginTop: mode === 'returning' ? '2rem' : '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          {mode === 'returning' ? (
            // Returning visitor — personalised buttons
            <>
              <motion.button
                custom={0} variants={btnVariants} initial="hidden" animate="visible"
                onClick={() => handleChoice(previousChoice!)}
                style={btnStyle(true)}
                onMouseEnter={(e) => applyHoverIn(e.currentTarget as HTMLButtonElement)}
                onMouseLeave={(e) => applyHoverOut(e.currentTarget as HTMLButtonElement)}
              >
                [ Nope, still a {previousChoice} ]
              </motion.button>
              <motion.button
                custom={1} variants={btnVariants} initial="hidden" animate="visible"
                onClick={() => handleChoice(otherChoice)}
                style={btnStyle(false)}
                onMouseEnter={(e) => applyHoverIn(e.currentTarget as HTMLButtonElement)}
                onMouseLeave={(e) => applyHoverOut(e.currentTarget as HTMLButtonElement)}
              >
                [ Actually, I&apos;m a {otherChoice} ]
              </motion.button>
            </>
          ) : (
            // New visitor — identity choice
            <>
              {[
                { label: "I'm here to hire", type: 'recruiter' as const },
                { label: "I'm a fellow developer", type: 'developer' as const },
              ].map((btn, i) => (
                <motion.button
                  key={btn.type}
                  custom={i} variants={btnVariants} initial="hidden" animate="visible"
                  onClick={() => handleChoice(btn.type)}
                  style={{
                    ...btnStyle(false),
                    width: mode === 'new-mobile' ? '100%' : 'auto',
                  }}
                  onMouseEnter={(e) => applyHoverIn(e.currentTarget as HTMLButtonElement)}
                  onMouseLeave={(e) => applyHoverOut(e.currentTarget as HTMLButtonElement)}
                >
                  [ {btn.label} ]
                </motion.button>
              ))}
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center items-start"
      style={{ background: '#000', padding: '0 clamp(1.5rem, 8vw, 6rem)' }}
    >
      {/* Lines */}
      {mode !== 'new-mobile' && (
        <div className="space-y-4 w-full max-w-2xl">
          {activeLinesForMode.map((line, i) => (
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
                    lineHeight: 1.65,
                  }}
                >
                  {line.text}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
          <IdentityButtons />
        </div>
      )}

      {/* Mobile: full-screen centred buttons */}
      {mode === 'new-mobile' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            gap: '1rem',
            maxWidth: '20rem',
            margin: '0 auto',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: '#64748b',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            who are you?
          </p>
          <IdentityButtons />
        </div>
      )}

      {/* Skip intro */}
      <AnimatePresence>
        {showSkip && !showButtons && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleSkip}
            style={{
              position: 'fixed', bottom: '1.5rem', right: '1.5rem',
              background: 'none', border: 'none', color: '#475569',
              cursor: 'pointer',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.8rem', letterSpacing: '0.05em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#475569')}
          >
            skip intro →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── style helpers ─────────────────────────────────────────────────────────────

const btnStyle = (primary: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  border: '1px solid rgba(226,232,240,0.25)',
  color: '#e2e8f0',
  background: primary ? 'rgba(226,232,240,0.04)' : 'transparent',
  padding: '0.75rem 1.75rem',
  cursor: 'pointer',
  fontSize: '1rem',
  letterSpacing: '0.02em',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap' as const,
});

const applyHoverIn = (el: HTMLButtonElement) => {
  el.style.boxShadow = '0 0 20px rgba(226,232,240,0.2), inset 0 0 20px rgba(226,232,240,0.04)';
  el.style.borderColor = 'rgba(226,232,240,0.6)';
};
const applyHoverOut = (el: HTMLButtonElement) => {
  el.style.boxShadow = 'none';
  el.style.borderColor = 'rgba(226,232,240,0.25)';
};
