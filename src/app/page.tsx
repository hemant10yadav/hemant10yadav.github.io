'use client';

import { GoogleAnalytics } from 'nextjs-google-analytics';
import { motion } from 'framer-motion';

import { ViewerProvider, useViewer } from './context/ViewerContext';
import { HeroSection } from './components/HeroSection';
import SkillSection from './components/SkillSection';
import { ProjectSection } from './components/ProjectSection';
import ExperienceSection from './components/ExperienceSection';
import { NavBar } from './components/Navbar';
import EasterEgg from './components/EasterEgg';
import GitHubActivity from './components/GitHubActivity';
import FailuresLog from './components/FailuresLog';
import Pulse from './components/Pulse';
import CLITerminal from './components/CLITerminal';

// ── inner app — has access to ViewerContext ────────────────────────────────────

function PortfolioApp() {
  const { viewerType, ready } = useViewer();

  // Wait until the URL has been read client-side to avoid hydration mismatch
  if (!ready) {
    return <div className="min-h-screen" style={{ background: '#080c14' }} />;
  }

  return (
    <>
      <GoogleAnalytics trackPageViews />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen text-white"
        style={{ background: '#080c14' }}
      >
        <NavBar />
        <main className="pt-20">
          <HeroSection viewerType={viewerType} />
          <ExperienceSection viewerType={viewerType} />
          <section id="skills">
            <SkillSection viewerType={viewerType} />
          </section>
          <section id="projects" className="pb-24">
            <ProjectSection viewerType={viewerType} />
          </section>
          {viewerType === 'developer' && <FailuresLog />}
          <Pulse />
          <CLITerminal />
        </main>
        <EasterEgg />
        <GitHubActivity />
      </motion.div>
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
