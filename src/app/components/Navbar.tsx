'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useViewer } from '../context/ViewerContext';

export const NavBar = () => {
  const { viewerType, accent, colorMode, toggleViewerType, toggleColorMode } = useViewer();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('about');
  const [scrolled, setScrolled] = useState(false);

  const isRecruiter = viewerType === 'recruiter';
  const isLab       = pathname === '/lab';
  const isDark      = colorMode === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const navLinkColor = 'var(--fg-3)';
  const navLinkHover = 'var(--fg-2)';

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
        background: scrolled ? 'var(--bg-navbar-solid)' : 'var(--bg-navbar)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? `${accent}25` : 'var(--border-2)'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Accent top line */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`,
          opacity: 0.6,
        }}
      />

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <Link href="/" passHref>
            <motion.div whileHover={{ scale: 1.04 }} style={{ cursor: 'pointer' }} />
          </Link>

          <div style={{ display: 'flex', gap: '0.15rem', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {/* Hash links */}
            {!isLab && hashLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setActiveSection(link.id)}
                  whileHover={{ scale: 1.04 }}
                  style={{
                    position: 'relative', padding: '0.4rem 0.55rem', borderRadius: '6px',
                    fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    letterSpacing: '0.04em',
                    color: isActive ? accent : navLinkColor,
                    textDecoration: 'none', transition: 'color 0.2s',
                    background: isActive ? `${accent}0f` : 'transparent', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = navLinkHover; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = navLinkColor; }}
                >
                  {isActive && (
                    <motion.span layoutId="nav-indicator" style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: accent, display: 'block', boxShadow: `0 0 6px ${accent}` }} />
                  )}
                  {link.label}
                </motion.a>
              );
            })}

            {/* /lab link */}
            <Link href={isLab ? '/' : '/lab'} passHref>
              <motion.span
                whileHover={{ scale: 1.04 }}
                style={{
                  position: 'relative', padding: '0.4rem 0.55rem', borderRadius: '6px',
                  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  letterSpacing: '0.04em',
                  color: isLab ? accent : navLinkColor,
                  textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s',
                  background: isLab ? `${accent}0f` : 'transparent', whiteSpace: 'nowrap',
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                }}
                onMouseEnter={(e) => { if (!isLab) (e.currentTarget as HTMLElement).style.color = navLinkHover; }}
                onMouseLeave={(e) => { if (!isLab) (e.currentTarget as HTMLElement).style.color = navLinkColor; }}
              >
                {isLab && (
                  <motion.span layoutId="nav-indicator" style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: accent, display: 'block', boxShadow: `0 0 6px ${accent}` }} />
                )}
                {isLab ? '← home' : '/lab'}
              </motion.span>
            </Link>

            {/* Dark / light toggle */}
            <motion.button
              onClick={toggleColorMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                marginLeft: '0.4rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '2rem', height: '2rem', borderRadius: '8px',
                background: 'transparent',
                border: `1px solid var(--border-2)`,
                color: 'var(--fg-3)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.color = accent;
                el.style.borderColor = `${accent}50`;
                el.style.background = `${accent}10`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.color = 'var(--fg-3)';
                el.style.borderColor = 'var(--border-2)';
                el.style.background = 'transparent';
              }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </motion.button>

            {/* Viewer toggle */}
            <motion.button
              onClick={toggleViewerType}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginLeft: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: '999px',
                background: `${accent}14`, border: `1px solid ${accent}30`, color: accent,
                fontSize: '0.65rem', fontFamily: 'var(--font-jetbrains-mono), monospace',
                letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
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
