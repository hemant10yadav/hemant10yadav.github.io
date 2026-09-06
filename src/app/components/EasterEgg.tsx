'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewer, RECRUITER_ACCENT, DEVELOPER_ACCENT } from '../context/ViewerContext';

// Condensed content snippets for each side of the split screen
const RECRUITER_SNIPPET = {
  headline: 'I ship things that scale.',
  sub: '4 years · 2 companies · 0 production fires I didn\'t put out.',
  points: [
    'Python, Django — systems serving NGOs across 130+ countries',
    'Spring Boot APIs handling enterprise-level traffic',
    'AWS, Docker, PostgreSQL — infrastructure that holds',
  ],
  cta: 'Let\'s talk about what I can build →',
  accent: RECRUITER_ACCENT,
};

const DEVELOPER_SNIPPET = {
  headline: 'Here\'s what actually happened.',
  sub: 'The decisions, the tradeoffs, the 2am bugs. The real version.',
  points: [
    'Django — where I live. 2 years deep.',
    'Spring Boot — Hibernate made me cry once.',
    'AWS — still afraid of billing alerts.',
  ],
  cta: 'Let\'s build something weird together →',
  accent: DEVELOPER_ACCENT,
};

export default function EasterEgg() {
  const { viewerType } = useViewer();
  const [isOpen, setIsOpen] = useState(false);
  const [activeToggle, setActiveToggle] = useState<'recruiter' | 'developer'>('recruiter');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Keep toggle in sync with current view when opening
  const handleOpen = () => {
    setActiveToggle(viewerType === 'developer' ? 'recruiter' : 'developer');
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <>
      {/* Trigger line */}
      <div className="flex justify-center pb-16 pt-8">
        <motion.button
          onClick={handleOpen}
          whileHover={{ color: 'var(--fg)' }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--fg-2)',
            cursor: 'pointer',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
          }}
        >
          curious what the other side looks like?
        </motion.button>
      </div>

      {/* Split-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="easter-egg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ background: '#000' }}
          >
            {isMobile ? (
              /* ── Mobile: toggle ───────────────────────────────────────────── */
              <div className="flex flex-col h-full">
                {/* Toggle tabs */}
                <div className="flex border-b border-white/10">
                  {(['recruiter', 'developer'] as const).map((side) => {
                    const data = side === 'recruiter' ? RECRUITER_SNIPPET : DEVELOPER_SNIPPET;
                    return (
                      <button
                        key={side}
                        onClick={() => setActiveToggle(side)}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          background: activeToggle === side ? 'rgba(255,255,255,0.05)' : 'transparent',
                          border: 'none',
                          borderBottom: activeToggle === side ? `2px solid ${data.accent}` : '2px solid transparent',
                          color: activeToggle === side ? data.accent : '#64748b',
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {side === 'recruiter' ? 'Recruiter View' : 'Developer View'}
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    <MobileSideContent
                      key={activeToggle}
                      data={activeToggle === 'recruiter' ? RECRUITER_SNIPPET : DEVELOPER_SNIPPET}
                    />
                  </AnimatePresence>
                </div>

                {/* Center message */}
                <div className="px-6 py-4 text-center border-t border-white/10">
                  <p
                    style={{
                      color: '#94a3b8',
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Same person. Both true. That&apos;s the point.
                  </p>
                </div>

                {/* Close */}
                <button
                  onClick={handleClose}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#e2e8f0',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              /* ── Desktop: split screen ────────────────────────────────────── */
              <div className="flex h-full relative">
                {/* Left – Recruiter */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-1/2 h-full overflow-y-auto flex flex-col justify-center p-6 md:p-12 lg:p-16"
                  style={{
                    background: 'rgba(110,231,183,0.04)',
                    borderRight: '1px solid rgba(110,231,183,0.15)',
                  }}
                >
                  <SideContent data={RECRUITER_SNIPPET} label="Recruiter View" />
                </motion.div>

                {/* Right – Developer */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-1/2 h-full overflow-y-auto flex flex-col justify-center p-6 md:p-12 lg:p-16"
                  style={{ background: 'rgba(34,211,238,0.04)' }}
                >
                  <SideContent data={DEVELOPER_SNIPPET} label="Developer View" />
                </motion.div>

                {/* Center text */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    zIndex: 10,
                    background: '#000',
                    padding: '1.5rem 2rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    maxWidth: '260px',
                    width: '100%',
                  }}
                >
                  <p
                    style={{
                      color: '#94a3b8',
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: '0.8rem',
                      letterSpacing: '0.06em',
                      lineHeight: 1.7,
                    }}
                  >
                    Same person.
                    <br />
                    Both true.
                    <br />
                    That&apos;s the point.
                  </p>
                </motion.div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e2e8f0',
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.18)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.08)')
                  }
                >
                  ×
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

interface SnippetData {
  headline: string;
  sub: string;
  points: string[];
  cta: string;
  accent: string;
}

function SideContent({ data, label }: { data: SnippetData; label: string }) {
  return (
    <div className="space-y-6">
      <p
        style={{
          color: data.accent,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}
      >
        {label}
      </p>
      <h2
        style={{
          color: '#e2e8f0',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {data.headline}
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{data.sub}</p>
      <ul className="space-y-2">
        {data.points.map((point, i) => (
          <li
            key={i}
            style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              paddingLeft: '1rem',
              borderLeft: `2px solid ${data.accent}40`,
              lineHeight: 1.6,
            }}
          >
            {point}
          </li>
        ))}
      </ul>
      <p
        style={{
          color: data.accent,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '0.85rem',
          marginTop: '1rem',
          opacity: 0.8,
        }}
      >
        {data.cta}
      </p>
    </div>
  );
}

function MobileSideContent({ data }: { data: SnippetData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <SideContent data={data} label="" />
    </motion.div>
  );
}
