'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useViewer } from '../context/ViewerContext';

export const NavBar = () => {
  const { viewerType, accent, toggleViewerType } = useViewer();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('about');
  const [scrolled, setScrolled] = useState(false);

  const isRecruiter = viewerType === 'recruiter';
  const isLab = pathname === '/lab';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Only observe sections on the main page
  useEffect(() => {
    if (isLab) return;
    const sections = ['about', 'skills', 'projects'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -55% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isLab]);

  const hashLinks = [
    { id: 'about',    label: 'About' },
    { id: 'skills',   label: 'Skills' },
    { id: 'projects', label: 'Projects' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        background: scrolled ? 'rgba(8,12,20,0.92)' : 'rgba(8,12,20,0.6)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? `${accent}25` : 'rgba(255,255,255,0.04)'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Thin accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`,
          opacity: 0.6,
        }}
      />

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>

          {/* Logo — always links home */}
          <Link href="/" passHref>
            <motion.div whileHover={{ scale: 1.04 }} style={{ cursor: 'pointer' }} />
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: '0.15rem', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>

            {/* Hash links — only meaningful on main page */}
            {!isLab && hashLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setActiveSection(link.id)}
                  whileHover={{ scale: 1.04 }}
                  style={{
                    position: 'relative',
                    padding: '0.4rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    letterSpacing: '0.04em',
                    color: isActive ? accent : '#64748b',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    background: isActive ? `${accent}0f` : 'transparent',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#64748b';
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: accent,
                        display: 'block',
                        boxShadow: `0 0 6px ${accent}`,
                      }}
                    />
                  )}
                  {link.label}
                </motion.a>
              );
            })}

            {/* Lab link */}
            <Link href={isLab ? '/' : '/lab'} passHref>
              <motion.span
                whileHover={{ scale: 1.04 }}
                style={{
                  position: 'relative',
                  padding: '0.4rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  letterSpacing: '0.04em',
                  color: isLab ? accent : '#64748b',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  background: isLab ? `${accent}0f` : 'transparent',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                onMouseEnter={(e) => {
                  if (!isLab) (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  if (!isLab) (e.currentTarget as HTMLElement).style.color = '#64748b';
                }}
              >
                {isLab && (
                  <motion.span
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: accent,
                      display: 'block',
                      boxShadow: `0 0 6px ${accent}`,
                    }}
                  />
                )}
                {isLab ? '← home' : '/lab'}
              </motion.span>
            </Link>

            {/* Viewer toggle */}
            <motion.button
              onClick={toggleViewerType}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginLeft: '0.5rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: `${accent}14`,
                border: `1px solid ${accent}30`,
                color: accent,
                fontSize: '0.65rem',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = `${accent}25`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}60`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = `${accent}14`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}30`;
              }}
            >
              {isRecruiter ? 'Recruiter View' : 'Dev View'} ⇄
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
