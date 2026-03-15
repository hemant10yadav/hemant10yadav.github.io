'use client';

import { motion } from 'framer-motion';
import { FileDown, Github, Linkedin, Mail, Layers, LucideProps } from 'lucide-react';
import { event } from 'nextjs-google-analytics';
import { ProfileImage } from './ProfileImage';
import { useEffect, useState } from 'react';
import { MessageModal } from './MessageModal';
import { ViewerType, useViewer } from '../context/ViewerContext';

export type SocialLink = {
  icon: React.ElementType<LucideProps>;
  link: string;
  title: string;
};

interface HeroSectionProps {
  viewerType: NonNullable<ViewerType>;
}

const getRoundedExperience = (): string => {
  const start = new Date('2021-12-01');
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
    { icon: Github, link: 'https://github.com/hemant10yadav', title: 'GitHub' },
    { icon: Linkedin, link: 'https://www.linkedin.com/in/hemantyad', title: 'Linkedin' },
    { icon: Mail, link: 'mailto:hemant.10.yadav@gmail.com', title: 'Mail' },
    {
      icon: Layers,
      link: 'https://stackoverflow.com/users/20470646/hemant-singh-yadav',
      title: 'Stackoverflow',
    },
  ];

  const domain = 'https://raw.githubusercontent.com/hemant10yadav/Resources/main/';
  const profilePicUrl = `${domain}hy-min.png`;

  const handleResumeDownload = () => {
    event('resume_download', { category: 'Portfolio', label: 'Resume Downloads', value: 1 });
    if (isMobile) {
      window.open(
        'https://docs.google.com/document/d/1slEvO5HrIn7_M5ehOEjefiW7ND6MDfgW0UtzZCKT0Qo/export?format=pdf',
        '_blank',
      );
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
        ctaHref: "mailto:hemant.10.yadav@gmail.com",
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
        ctaHref: "https://github.com/hemant10yadav",
      };

  return (
    <div>
      {/* Background */}
      <div className="absolute inset-0" style={{ background: '#080c14' }}>
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
        className="min-h-screen flex items-center relative overflow-hidden"
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
                  Hemant Singh Yadav
                </motion.span>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#e2e8f0',
                  }}
                >
                  {content.headline}
                  {content.headlineSub && (
                    <span style={{ color: accent }}> {content.headlineSub}</span>
                  )}
                </motion.h1>

                {/* Sub-line */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: '#94a3b8',
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
                transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                {/* Primary CTA */}
                <a
                  href={content.ctaHref}
                  target={isRecruiter ? '_self' : '_blank'}
                  rel="noopener noreferrer"
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
                    transition: 'opacity 0.2s, box-shadow 0.2s',
                    boxShadow: `0 0 20px ${accent}40`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                  }}
                >
                  {content.ctaLabel}
                </a>

                {/* Resume */}
                <button
                  onClick={handleResumeDownload}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: '#e2e8f0',
                    border: '1px solid rgba(226,232,240,0.2)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(226,232,240,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(226,232,240,0.2)';
                  }}
                >
                  <FileDown size={18} />
                  Resume
                </button>

                {/* Message */}
                <button
                  onClick={() => setOpenMessage(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: '#e2e8f0',
                    border: '1px solid rgba(226,232,240,0.2)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(226,232,240,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(226,232,240,0.2)';
                  }}
                >
                  <Mail size={18} />
                  Message Me
                </button>
              </motion.div>

              {/* Social icons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
                        color: '#94a3b8',
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
              <ProfileImage profilePicUrl={profilePicUrl} viewerType={viewerType} />
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
                  href="https://docs.google.com/document/d/1slEvO5HrIn7_M5ehOEjefiW7ND6MDfgW0UtzZCKT0Qo/export?format=pdf"
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
                src="https://docs.google.com/document/d/e/2PACX-1vRy5MkRddjiK9wAMN2uIEqFV7t58Ywa8XVK_gNIqpz-7YajDTfmhdqdYjMe2mG5ZHkPVQg1WzK2DbDq/pub?embedded=true"
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
  'Summoning PDF powers… 💫',
  'Almost there… ✨',
  'Fetching the magic… 🪄',
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
