'use client';

import { motion } from 'framer-motion';
import { FileDown, Github, Linkedin, Mail, Layers, LucideProps } from 'lucide-react';
import { event } from 'nextjs-google-analytics';
import { ProfileImage } from './ProfileImage';
import { useEffect, useState } from 'react';
import { MessageModal } from './MessageModal';
import { ViewerType, useViewer } from '../context/ViewerContext';
import {
  FULL_NAME, GITHUB_URL, LINKEDIN_URL, SO_URL, MAILTO,
  PROFILE_PIC_URL, RESUME_PDF_URL, RESUME_EMBED_URL, CAREER_START,
} from '../constants';

export type SocialLink = {
  icon: React.ElementType<LucideProps>;
  link: string;
  title: string;
};

interface HeroSectionProps {
  viewerType: NonNullable<ViewerType>;
}

const getRoundedExperience = (): string => {
  const start = CAREER_START;
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return months >= 6 ? `${years}.5 years` : `${years} years`;
};

export const HeroSection = ({ viewerType }: HeroSectionProps) => {
  const { accent } = useViewer();
  const [openIframe, setOpenIframe] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isRecruiter = viewerType === 'recruiter';
  const experience = getRoundedExperience();

  useEffect(() => {
    if (openIframe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIframe(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [openIframe]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const socialLinks: SocialLink[] = [
    { icon: Github,   link: GITHUB_URL,   title: 'GitHub' },
    { icon: Linkedin, link: LINKEDIN_URL,  title: 'Linkedin' },
    { icon: Mail,     link: MAILTO,        title: 'Mail' },
    { icon: Layers,   link: SO_URL,        title: 'Stackoverflow' },
  ];

  const handleResumeDownload = () => {
    event('resume_download', { category: 'Portfolio', label: 'Resume Downloads', value: 1 });
    if (isMobile) {
      window.open(RESUME_PDF_URL, '_blank');
    } else {
      setOpenIframe(true);
    }
  };

  const handleExternalLink = (linkClicked: string) => {
    event('external_links', { category: 'Portfolio', label: `${linkClicked} visits`, value: 1 });
  };

  // ── content per viewer type ────────────────────────────────────────────────

  const content = isRecruiter
    ? {
        headline: "I ship things that scale.",
        headlineSub: "Here's proof.",
        subline: `${experience} · 2 companies · I've seen what breaks at scale. I build around it.`,
        about:
          `At Dimagi, I maintain systems used by frontline health workers across 130 countries. At Xcaliber, ` +
          `I built one Spring Boot backend that powered web, Android, and iOS simultaneously. ` +
          `I build for scale, correctness, and the person on-call at 3am.`,
        ctaLabel: "Let's talk about what I can build for your team →",
        ctaHref: MAILTO,
      }
    : {
        headline: "Here's what actually happened.",
        headlineSub: "",
        subline:
          "The decisions, the tradeoffs, the 2am bugs. The real version.",
        about:
          `I've spent ${experience} navigating the gap between "it works on my machine" and ` +
          `"it works for 10,000 users." I've over-engineered things, simplified them, shipped ` +
          `them, and learned why boring code is often the best code.`,
        ctaLabel: "Let's build something weird together →",
        ctaHref: GITHUB_URL,
      };

  return (
    <div>
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'var(--bg)' }}>
        <div
          className="absolute inset-0"
          style={{
            background: isRecruiter
              ? 'radial-gradient(ellipse at center, rgba(110,231,183,0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      <section
        id="about"
        className="min-h-[100dvh] flex items-center relative overflow-hidden"
      >
        <div className="container mx-auto px-6 py-16 relative">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* ── Text ────────────────────────────────────────────────────────── */}
            <motion.div
              key={viewerType}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 space-y-8"
            >
              <div className="space-y-5">
                {/* Name badge */}
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    background: `${accent}18`,
                    color: accent,
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                  }}
                >
                  {FULL_NAME}
                </motion.span>

                {/* Headline — word-by-word stagger */}
                <h1
                  style={{
                    fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: '-0.025em',
                    color: 'var(--fg)',
                  }}
                >
                  {content.headline.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: 'inline-block', marginRight: '0.28em' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  {content.headlineSub && (
                    <motion.span
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.1 + content.headline.split(' ').length * 0.055,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ display: 'inline-block', color: accent, marginLeft: '0.15em' }}
                    >
                      {content.headlineSub}
                    </motion.span>
                  )}
                </h1>

                {/* Sub-line */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.48, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    color: accent,
                    fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {content.subline}
                </motion.p>

                {/* About */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    color: 'var(--fg-2)',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    maxWidth: '42rem',
                  }}
                >
                  {content.about}
                </motion.p>
              </div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.68, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-4"
              >
                {/* Primary CTA */}
                <motion.a
                  href={content.ctaHref}
                  target={isRecruiter ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: accent,
                    color: '#000',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    textDecoration: 'none',
                    boxShadow: `0 4px 14px ${accent}35`,
                  }}
                >
                  {content.ctaLabel}
                </motion.a>

                {/* Resume */}
                <motion.button
                  type="button"
                  onClick={handleResumeDownload}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: 'var(--fg)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fg-3)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                >
                  <FileDown size={18} />
                  Resume
                </motion.button>

                {/* Message */}
                <motion.button
                  type="button"
                  onClick={() => setOpenMessage(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: 'var(--fg)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fg-3)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                >
                  <Mail size={18} />
                  Message Me
                </motion.button>
              </motion.div>

              {/* Social icons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.76, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4"
              >
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      onClick={() => handleExternalLink(social.title)}
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full transition-all"
                      style={{
                        background: `${accent}12`,
                        color: 'var(--fg-2)',
                        transition: 'color 0.2s, background 0.2s',
                      }}
                      whileHover={{ y: -2, color: accent }}
                      title={social.title}
                    >
                      <IconComponent size={22} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* ── Profile image ────────────────────────────────────────────────── */}
            <div className="relative hidden md:block" style={{ flexShrink: 0 }}>
              <ProfileImage profilePicUrl={PROFILE_PIC_URL} viewerType={viewerType} />
            </div>
          </div>
        </div>
      </section>

      {/* Resume iframe overlay */}
      {openIframe && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setOpenIframe(false)} />
          <div className="relative z-10 max-h-[95vh] w-full flex justify-center overflow-auto">
            <div className="relative bg-white rounded-lg shadow-xl w-[820px] max-w-[95vw] h-[95vh]">
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <a
                  href={RESUME_PDF_URL}
                  rel="noopener noreferrer"
                  className="bg-black/70 text-white px-3 py-1 rounded hover:bg-black/80"
                  title="Download PDF"
                >
                  ⬇
                </a>
                <button
                  onClick={() => setOpenIframe(false)}
                  className="bg-black/70 text-white px-3 py-1 rounded hover:bg-black/80"
                  title="Close"
                >
                  ✕
                </button>
              </div>
              <IframeWithLoader
                src={RESUME_EMBED_URL}
                title="Resume"
              />
            </div>
          </div>
        </div>
      )}

      {openMessage && <MessageModal onClose={() => setOpenMessage(false)} viewerType={viewerType} />}
    </div>
  );
};

// ── iframe loader ──────────────────────────────────────────────────────────────

const phrases = [
  'Loading resume…',
  'Almost there…',
  'Hang tight…',
];

const IframeWithLoader = ({ src, title }: { src: string; title: string }) => {
  const [loading, setLoading] = useState(true);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">
          <div className="w-16 h-16 border-4 border-t-amber-500 border-b-cyan-500 border-l-transparent border-r-transparent rounded-full animate-spin" />
          <span className="mt-4 text-gray-600 text-lg font-semibold text-center">
            {phrases[currentPhrase]}
          </span>
        </div>
      )}
      <iframe src={src} title={title} className="w-full h-full" onLoad={() => setLoading(false)} />
    </div>
  );
};
