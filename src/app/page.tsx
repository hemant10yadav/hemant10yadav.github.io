'use client';

import { GoogleAnalytics } from 'nextjs-google-analytics';
import { motion } from 'framer-motion';

import { useViewer } from './context/ViewerContext';
import { HeroSection } from './components/HeroSection';
import SkillSection from './components/SkillSection';
import { ProjectSection } from './components/ProjectSection';
import ExperienceSection from './components/ExperienceSection';
import EasterEgg from './components/EasterEgg';
import LabTeaser from './components/LabTeaser';

function PortfolioApp() {
  const { viewerType, ready } = useViewer();

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
        <main className="pt-20">
          <HeroSection viewerType={viewerType} />
          <ExperienceSection viewerType={viewerType} />
          <section id="skills">
            <SkillSection viewerType={viewerType} />
          </section>
          <section id="projects" className="pb-24">
            <ProjectSection viewerType={viewerType} />
          </section>
          <LabTeaser />
        </main>
        <EasterEgg />
      </motion.div>
    </>
  );
}

export default function Home() {
  return <PortfolioApp />;
}
