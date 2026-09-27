'use client';

import { useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Github, Linkedin, Mail, MessageSquare } from 'lucide-react';
import { event } from 'nextjs-google-analytics';
import { MessageModal } from './MessageModal';
import { ViewerType, useViewer } from '../context/ViewerContext';
import { EMAIL, FULL_NAME, GITHUB_URL, LINKEDIN_URL, MAILTO, RESUME_PDF_URL } from '../constants';

const CONTENT = {
  recruiter: {
    tag: 'Contact',
    title: "Let's talk",
    sub: "Hiring for a backend or full-stack role? Send me a note and I'll get back to you within 24 hours.",
  },
  developer: {
    tag: '// contact',
    title: "Let's build something",
    sub: "Drop a line. I'll reply, probably with opinions.",
  },
};

export default function ContactSection({ viewerType }: { viewerType: NonNullable<ViewerType> }) {
  const { accent } = useViewer();
  const [openMessage, setOpenMessage] = useState(false);
  const { tag, title, sub } = CONTENT[viewerType];
  const mono = 'var(--font-jetbrains-mono), monospace';

  const track = (label: string) => event('contact_clicked', { category: 'Portfolio', label, value: 1 });

  const buttonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.4rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    textDecoration: 'none',
    cursor: 'pointer',
  };
  const secondaryStyle: CSSProperties = {
    ...buttonStyle,
    background: 'transparent',
    color: 'var(--fg)',
    border: '1px solid var(--border)',
  };

  return (
    <section id="contact" className="relative" style={{ background: 'var(--bg)' }}>
      <div className="container mx-auto px-6 pb-12 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${accent}30`,
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 5vw, 3rem)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.2rem 0.75rem',
              borderRadius: '4px',
              background: `${accent}14`,
              color: accent,
              fontFamily: mono,
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            {tag}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--fg)',
            }}
          >
            {title}
          </h2>
          <p style={{ color: 'var(--fg-3)', fontSize: '1rem', lineHeight: 1.6, marginTop: '0.5rem', maxWidth: '36rem' }}>
            {sub}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={MAILTO}
              onClick={() => track('Email')}
              style={{ ...buttonStyle, background: accent, color: 'var(--bg)', fontWeight: 600, fontFamily: mono }}
            >
              <Mail size={18} /> {EMAIL}
            </a>
            <button type="button" onClick={() => { track('Message'); setOpenMessage(true); }} style={secondaryStyle}>
              <MessageSquare size={18} /> Message me
            </button>
            <a
              href={RESUME_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => event('resume_download', { category: 'Portfolio', label: 'Resume Downloads', value: 1 })}
              style={secondaryStyle}
            >
              <FileDown size={18} /> Resume
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('LinkedIn')} style={secondaryStyle}>
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('GitHub')} style={secondaryStyle}>
              <Github size={18} /> GitHub
            </a>
          </div>
        </motion.div>

        <footer
          className="mt-10 flex flex-wrap justify-between gap-2"
          style={{ fontFamily: mono, fontSize: '0.75rem', color: 'var(--fg-4)' }}
        >
          <span>© {new Date().getFullYear()} {FULL_NAME}</span>
          <span>Built with Next.js</span>
        </footer>
      </div>

      {openMessage && <MessageModal onClose={() => setOpenMessage(false)} viewerType={viewerType} />}
    </section>
  );
}
