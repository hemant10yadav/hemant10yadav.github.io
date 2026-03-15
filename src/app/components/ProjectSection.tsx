'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { ViewerType, useViewer } from '../context/ViewerContext';

interface ProjectSectionProps {
  viewerType: NonNullable<ViewerType>;
}

// ── project data for both views ──────────────────────────────────────────────

const RECRUITER_PROJECTS = [
  {
    title: 'E-Commerce Platform',
    problem: 'Personal project to explore full-stack architecture — from auth to checkout — using a Java + Angular stack.',
    solution: 'Spring Boot REST API, Angular SPA, PostgreSQL with clean schema design, JWT auth with layered service/repository separation.',
    impact: 'Demonstrates system design thinking: bounded contexts, DTO patterns, and an architecture structured to scale.',
    githubLink: 'https://github.com/hemant10yadav/E-Commerce-website',
    tech: ['java.png', 'spring.png', 'angular.png', 'typescript.png', 'postgres.png'],
  },
  {
    title: 'E-Store',
    problem: 'Side project to learn the MERN stack end-to-end — from React component design to MongoDB document modelling.',
    solution: 'React frontend, Node/Express REST APIs, MongoDB with Mongoose, auth and session handling.',
    impact: 'Shows ability to pick up a new stack independently and deliver a complete, working full-stack application.',
    githubLink: 'https://github.com/hemant10yadav/Sell2U-Node',
    tech: ['typescript.png', 'react.png', 'node.png', 'express.png', 'mongo.png'],
  },
  {
    title: 'Book Store',
    problem: 'Side project to practice Angular\'s component model and API integration — no backend required.',
    solution: 'Angular SPA consuming the Google Books API, search by title/author/keyword, rich detail views, deployed on GitHub Pages.',
    impact: 'Live demo available. Shows frontend-first thinking: fast load, responsive UI, zero infrastructure overhead.',
    githubLink: 'https://github.com/hemant10yadav/book-store',
    demoUrl: 'https://hemant10yadav.github.io/book-store/',
    tech: ['bootstrap.png', 'angular.png', 'typescript.png'],
  },
];

const DEVELOPER_PROJECTS = [
  {
    title: 'E-Commerce Platform',
    tried: 'Started with a custom auth system with refresh token rotation and per-device sessions. Very elegant. Very overengineered.',
    broke: 'Broke in staging when two concurrent requests hit the token refresh endpoint. Race condition.',
    learned: 'Boring code is good code. Simplified to standard JWT + stateless. Shipped. Never thought about it again.',
    githubLink: 'https://github.com/hemant10yadav/E-Commerce-website',
    tech: ['java.png', 'spring.png', 'angular.png', 'typescript.png', 'postgres.png'],
  },
  {
    title: 'E-Store',
    tried: 'MongoDB because "schemaless = flexible." Designed the product documents to hold everything: reviews, variants, stock.',
    broke: 'Querying nested arrays for specific review authors became an aggregation pipeline nightmare.',
    learned: 'Schema-less doesn\'t mean schema-free. Design your documents for how you read, not how you write.',
    githubLink: 'https://github.com/hemant10yadav/Sell2U-Node',
    tech: ['typescript.png', 'react.png', 'node.png', 'express.png', 'mongo.png'],
  },
  {
    title: 'Book Store',
    tried: 'Wanted infinite scroll, offline caching, and a custom debounce hook — for a book search page.',
    broke: 'Nothing broke, but I spent 3 days on things no user would notice.',
    learned: 'Sometimes a simple input + button is the product. Shipped a fast, usable app. Live demo still runs.',
    githubLink: 'https://github.com/hemant10yadav/book-store',
    demoUrl: 'https://hemant10yadav.github.io/book-store/',
    tech: ['bootstrap.png', 'angular.png', 'typescript.png'],
  },
];

export const ProjectSection = ({ viewerType }: ProjectSectionProps) => {
  const { accent } = useViewer();
  const [activeDemoUrl, setActiveDemoUrl] = useState<string | null>(null);
  const isRecruiter = viewerType === 'recruiter';

  const handleCodeView = (projectName: string) => {
    event('Code views', { category: 'Portfolio', label: projectName, value: 1 });
  };

  const handleDemoClick = (url: string, title: string) => {
    if (activeDemoUrl === url) {
      setActiveDemoUrl(null);
      return;
    }
    event('Video views', { category: 'Portfolio', label: title, value: 1 });
    setActiveDemoUrl(url);
  };

  return (
    <>
      <div className="container mx-auto px-6">
        <motion.div
          key={viewerType}
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              color: accent,
            }}
          >
            {isRecruiter ? 'Things I built' : 'What actually happened'}
          </h2>
          <p style={{ color: '#475569', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {isRecruiter
              ? 'personal projects · real decisions · code on GitHub'
              : 'the unedited version'}
          </p>
        </motion.div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}
        >
          {isRecruiter
            ? (RECRUITER_PROJECTS as typeof RECRUITER_PROJECTS).map((project, i) => (
                <RecruiterCard
                  key={project.title}
                  project={project}
                  index={i}
                  accent={accent}
                  onCodeView={() => handleCodeView(project.title)}
                  onDemoClick={() => project.demoUrl && handleDemoClick(project.demoUrl, project.title)}
                  activeDemoUrl={activeDemoUrl}
                />
              ))
            : (DEVELOPER_PROJECTS as typeof DEVELOPER_PROJECTS).map((project, i) => (
                <DeveloperCard
                  key={project.title}
                  project={project}
                  index={i}
                  accent={accent}
                  onCodeView={() => handleCodeView(project.title)}
                  onDemoClick={() => project.demoUrl && handleDemoClick(project.demoUrl, project.title)}
                  activeDemoUrl={activeDemoUrl}
                />
              ))}
        </div>
      </div>

      {/* Demo iframe */}
      {activeDemoUrl && (
        <div className="px-6 mt-8 w-full" style={{ maxWidth: '100%' }}>
          <div className="relative w-full" style={{ height: 'min(80vh, 500px)' }}>
            <div className="absolute inset-0">
              <iframe
                src={activeDemoUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setActiveDemoUrl(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ── sub-components ────────────────────────────────────────────────────────────

interface RecruiterProject {
  title: string;
  problem: string;
  solution: string;
  impact: string;
  githubLink: string;
  demoUrl?: string;
  tech: string[];
}

interface DeveloperProject {
  title: string;
  tried: string;
  broke: string;
  learned: string;
  githubLink: string;
  demoUrl?: string;
  tech: string[];
}

function RecruiterCard({
  project,
  index,
  accent,
  onCodeView,
  onDemoClick,
  activeDemoUrl,
}: {
  project: RecruiterProject;
  index: number;
  accent: string;
  onCodeView: () => void;
  onDemoClick: () => void;
  activeDemoUrl: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(110,231,183,0.12)',
        borderRadius: '12px',
        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          color: '#e2e8f0',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        {project.title}
      </h3>

      {[
        { label: 'Problem', text: project.problem },
        { label: 'Solution', text: project.solution },
        { label: 'Impact', text: project.impact },
      ].map(({ label, text }) => (
        <div key={label} className="mb-3">
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: accent,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            {label}
          </span>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65 }}>{text}</p>
        </div>
      ))}

      <TechRow icons={project.tech} />
      <ProjectLinks
        githubLink={project.githubLink}
        demoUrl={project.demoUrl}
        activeDemoUrl={activeDemoUrl}
        accent={accent}
        onCodeView={onCodeView}
        onDemoClick={onDemoClick}
      />
    </motion.div>
  );
}

function DeveloperCard({
  project,
  index,
  accent,
  onCodeView,
  onDemoClick,
  activeDemoUrl,
}: {
  project: DeveloperProject;
  index: number;
  accent: string;
  onCodeView: () => void;
  onDemoClick: () => void;
  activeDemoUrl: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(34,211,238,0.12)',
        borderRadius: '12px',
        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          color: '#e2e8f0',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        {project.title}
      </h3>

      {[
        { label: 'What I tried', text: project.tried },
        { label: 'What broke', text: project.broke },
        { label: 'What I learned', text: project.learned },
      ].map(({ label, text }) => (
        <div key={label} className="mb-3">
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: accent,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            {label}
          </span>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65 }}>{text}</p>
        </div>
      ))}

      <TechRow icons={project.tech} />
      <ProjectLinks
        githubLink={project.githubLink}
        demoUrl={project.demoUrl}
        activeDemoUrl={activeDemoUrl}
        accent={accent}
        onCodeView={onCodeView}
        onDemoClick={onDemoClick}
      />
    </motion.div>
  );
}

function TechRow({ icons }: { icons: string[] }) {
  return (
    <div className="flex gap-3 mt-4 mb-4">
      {icons.map((icon, i) => (
        <Image
          key={i}
          src={`/assets/${icon}`}
          alt={icon}
          width={28}
          height={28}
          className="object-contain"
          loading="lazy"
          draggable={false}
        />
      ))}
    </div>
  );
}

function ProjectLinks({
  githubLink,
  demoUrl,
  activeDemoUrl,
  accent,
  onCodeView,
  onDemoClick,
}: {
  githubLink: string;
  demoUrl?: string;
  activeDemoUrl: string | null;
  accent: string;
  onCodeView: () => void;
  onDemoClick: () => void;
}) {
  return (
    <div className="flex gap-4 mt-1">
      <motion.a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCodeView}
        className="inline-flex items-center gap-1.5"
        style={{ color: accent, fontSize: '0.875rem', textDecoration: 'none' }}
        whileHover={{ x: 4 }}
      >
        View Code <ExternalLink size={14} />
      </motion.a>
      {demoUrl && (
        <motion.button
          onClick={onDemoClick}
          className="inline-flex items-center gap-1.5"
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.875rem',
            cursor: 'pointer',
            padding: 0,
          }}
          whileHover={{ x: 4, color: '#94a3b8' }}
        >
          {activeDemoUrl === demoUrl ? 'Hide Demo' : 'Live Demo'}
        </motion.button>
      )}
    </div>
  );
}

export default ProjectSection;
