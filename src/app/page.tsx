'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleAnalytics } from 'nextjs-google-analytics';

import { ViewerProvider, useViewer, ViewerType } from './context/ViewerContext';
import WatchingYou from './components/WatchingYou';
import { HeroSection } from './components/HeroSection';
import SkillSection from './components/SkillSection';
import { ProjectSection } from './components/ProjectSection';
import ExperienceSection from './components/ExperienceSection';
import { NavBar } from './components/Navbar';
import EasterEgg from './components/EasterEgg';

// ── inner app — has access to ViewerContext ────────────────────────────────────

function PortfolioApp() {
  const { viewerType } = useViewer();

  // phase: 'act1' | 'fading' | 'portfolio'
  const [phase, setPhase] = useState<'act1' | 'fading' | 'portfolio'>('act1');
  // Snapshot the chosen type so it's available after act1 unmounts
  const [chosenType, setChosenType] = useState<NonNullable<ViewerType> | null>(null);

  useEffect(() => {
    if (viewerType !== null && phase === 'act1') {
      setChosenType(viewerType);
      setPhase('fading');
      const t = setTimeout(() => setPhase('portfolio'), 650);
      return () => clearTimeout(t);
    }
  }, [viewerType, phase]);

  return (
    <>
      <GoogleAnalytics trackPageViews />

      {/* ── Act 1: WatchingYou ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'act1' && (
          <motion.div
            key="act1"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
          >
            <WatchingYou />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Transition overlay: black screen fades out over portfolio ─────── */}
      <AnimatePresence>
        {phase === 'fading' && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: '#000',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Portfolio: renders under overlay during fading, then takes over ── */}
      {(phase === 'fading' || phase === 'portfolio') && chosenType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: phase === 'fading' ? 0.3 : 0 }}
          className="min-h-screen text-white"
          style={{ background: '#080c14' }}
        >
          <NavBar />
          <main className="pt-20">
            <HeroSection viewerType={chosenType} />
            <ExperienceSection viewerType={chosenType} />
            <section id="skills">
              <SkillSection viewerType={chosenType} />
            </section>
            <section id="projects" className="pb-24">
              <ProjectSection viewerType={chosenType} />
            </section>
          </main>
          <EasterEgg />
        </motion.div>
      )}
    </>
  );
}

// ── root export — provides context ────────────────────────────────────────────

export default function Home() {
  return (
    <ViewerProvider>
      <PortfolioApp />
    </ViewerProvider>
  );
}
