'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import { event } from 'nextjs-google-analytics';
import { ViewerType } from '../context/ViewerContext';

interface ExperienceSectionProps {
  viewerType: NonNullable<ViewerType>;
}

// ── shared data ───────────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    role: "Software Engineer",
    company: "Dimagi Inc.",
    url: "https://dimagi.com/",
    location: "Delhi, India",
    period: "Dec 2023 — Present",
    current: true,
    skills: ["Python", "Django", "Docker", "AWS", "PostgreSQL"],
    // recruiter view
    impact: [
      "Maintained systems serving NGOs across 130+ countries",
      "Containerised Django workloads with Docker, deployed on AWS",
      "Shipped production features across a decade-old Python codebase",
      "Owned backend features end-to-end — design, code, deploy, monitor",
    ],
    // developer view – git log style
    commitMsg: "feat: joined Dimagi Inc.",
    logLines: [
      "// first real encounter with CommCare — a codebase that",
      "//   spans a decade and runs in 130+ countries.",
      "//   humbling to read before you write.",
      "",
      "// docker in prod for the first time.",
      '//   turns out "works on my machine" can be a container.',
      "",
      "// lesson: understand the system before changing it.",
      "//   still learning that one.",
    ],
    hash: "a3f2b1c",
    branch: "HEAD -> main",
  },
  {
    role: "Software Engineer",
    company: "Xcaliber Infotech Pvt. Ltd.",
    url: "https://xcaliberinfotech.com/",
    location: "Pune, India",
    period: "Dec 2021 — Dec 2023",
    current: false,
    skills: ["Spring Boot", "Angular", "Hibernate", "REST APIs", "Amazon S3"],
    impact: [
      "Delivered Spring Boot REST APIs for enterprise clients",
      "Built Angular frontends consuming complex data models",
      "Integrated Amazon S3 for scalable file storage",
      "Worked full-stack across Java + TypeScript every day",
    ],
    commitMsg: "feat: joined Xcaliber Infotech",
    logLines: [
      "// spring boot. first week: confident.",
      "//   second week: Hibernate threw a LazyInitializationException.",
      "//   third week: finally understood @Transactional.",
      "",
      "// REST APIs felt natural after that.",
      "//   amazon S3 — simpler than I expected.",
      "",
      "// the day I stopped being scared of stack traces:",
      "//   priceless.",
    ],
    hash: "7d89e2a",
    branch: "origin/xcaliber",
  },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function ExperienceSection({ viewerType }: ExperienceSectionProps) {
  const isRecruiter = viewerType === 'recruiter';
  const accent = isRecruiter ? '#6ee7b7' : '#22d3ee';

  const handleLink = (company: string) => {
    event('external_links', { category: 'Portfolio', label: `${company} visits`, value: 1 });
  };

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: '#080c14' }}>
      {/* Subtle accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRecruiter
            ? 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(110,231,183,0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-6 max-w-5xl relative">
        {/* ── Heading ──────────────────────────────────────────────────────────── */}
        <motion.div
          key={viewerType}
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          {isRecruiter ? (
            <div className="text-center">
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 1rem',
                  borderRadius: '999px',
                  background: `${accent}18`,
                  color: accent,
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                Career Journey
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  color: '#e2e8f0',
                }}
              >
                Where I&apos;ve shipped
              </h2>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ color: accent, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  $
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    color: '#475569',
                    fontSize: '0.85rem',
                  }}
                >
                  git log --reverse --stat career/
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  background: `linear-gradient(90deg, ${accent}40 0%, transparent 60%)`,
                  marginTop: '0.75rem',
                }}
              />
            </div>
          )}
        </motion.div>

        {/* ── Content ──────────────────────────────────────────────────────────── */}
        {isRecruiter ? (
          <RecruiterTimeline experiences={EXPERIENCES} accent={accent} onLink={handleLink} />
        ) : (
          <DeveloperGitLog experiences={EXPERIENCES} accent={accent} onLink={handleLink} />
        )}
      </div>
    </section>
  );
}

// ── Recruiter: vertical timeline with impact bullets ──────────────────────────

function RecruiterTimeline({
  experiences,
  accent,
  onLink,
}: {
  experiences: typeof EXPERIENCES;
  accent: string;
  onLink: (c: string) => void;
}) {
  return (
    <div className="relative">
      {/* Vertical spine */}
      <div
        className="absolute left-5 top-0 bottom-0 w-px hidden md:block"
        style={{
          background: `linear-gradient(180deg, ${accent}60 0%, ${accent}10 100%)`,
        }}
      />

      <div className="space-y-10">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="md:pl-16 relative"
          >
            {/* Timeline node */}
            <div
              className="absolute left-0 top-6 hidden md:flex items-center justify-center"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                background: exp.current ? `${accent}20` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${exp.current ? accent : 'rgba(255,255,255,0.1)'}`,
                boxShadow: exp.current ? `0 0 16px ${accent}40` : 'none',
              }}
            >
              {exp.current && (
                <span
                  style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: accent,
                    display: 'block',
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
            </div>

            {/* Card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${exp.current ? `${accent}30` : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '14px',
                padding: 'clamp(1.25rem, 4vw, 1.75rem) clamp(1rem, 4vw, 2rem)',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}50`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = exp.current
                  ? `${accent}30`
                  : 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  {exp.current && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '999px',
                        background: `${accent}20`,
                        color: accent,
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                      }}
                    >
                      ● Present
                    </span>
                  )}
                  <h3
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#e2e8f0',
                      marginBottom: '0.3rem',
                    }}
                  >
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onLink(exp.company)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = accent)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0')
                      }
                    >
                      {exp.company} <ExternalLink size={14} />
                    </a>
                  </h3>
                  <div className="flex flex-wrap gap-4" style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    <span>{exp.role}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} /> {exp.location}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.78rem',
                    color: accent,
                    opacity: 0.8,
                    whiteSpace: 'nowrap',
                    paddingTop: '0.15rem',
                  }}
                >
                  {exp.period}
                </span>
              </div>

              {/* Impact bullets */}
              <ul className="space-y-2 mb-5">
                {exp.impact.map((point, pi) => (
                  <li
                    key={pi}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: accent, marginTop: '0.35rem', flexShrink: 0 }}>▸</span>
                    {point}
                  </li>
                ))}
              </ul>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: '0.2rem 0.65rem',
                      borderRadius: '6px',
                      background: `${accent}12`,
                      color: accent,
                      border: `1px solid ${accent}25`,
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Developer: git log terminal style ────────────────────────────────────────

function DeveloperGitLog({
  experiences,
  accent,
  onLink,
}: {
  experiences: typeof EXPERIENCES;
  accent: string;
  onLink: (c: string) => void;
}) {
  return (
    <div
      style={{
        background: '#0a0e1a',
        border: '1px solid rgba(34,211,238,0.12)',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          background: '#111827',
          padding: '0.6rem 1rem',
          borderBottom: '1px solid rgba(34,211,238,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: '#ef4444', display: 'block' }} />
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: '#6ee7b7', display: 'block' }} />
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: '#22c55e', display: 'block' }} />
        <span style={{ color: '#475569', fontSize: '0.72rem', marginLeft: '0.5rem' }}>
          zsh — career
        </span>
      </div>

      {/* Log body */}
      <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem) clamp(0.75rem, 4vw, 1.75rem)' }}>
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.15 }}
            style={{ marginBottom: i < experiences.length - 1 ? '2.5rem' : 0 }}
          >
            {/* commit hash + branch */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#f97316', fontSize: '0.82rem' }}>commit {exp.hash}</span>
              {exp.branch && (
                <span
                  style={{
                    padding: '0.1rem 0.5rem',
                    borderRadius: '4px',
                    background: `${accent}18`,
                    color: accent,
                    fontSize: '0.72rem',
                    border: `1px solid ${accent}25`,
                  }}
                >
                  ({exp.branch})
                </span>
              )}
            </div>

            {/* Author / Date */}
            <div style={{ color: '#475569', fontSize: '0.78rem', marginBottom: '0.65rem', lineHeight: 1.7 }}>
              <span>Author: Hemant Singh Yadav</span>
              <br />
              <span>Date: &nbsp;&nbsp;{exp.period}</span>
            </div>

            {/* Commit message */}
            <div style={{ marginLeft: '1rem', marginBottom: '0.75rem' }}>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {exp.commitMsg}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
                {exp.role} ·{' '}
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLink(exp.company)}
                  style={{
                    color: accent,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {exp.company} <ExternalLink size={11} />
                </a>
                {' '} · {exp.location}
              </p>
            </div>

            {/* Honest log lines */}
            <div
              style={{
                marginLeft: '1rem',
                borderLeft: `2px solid ${accent}25`,
                paddingLeft: '1rem',
              }}
            >
              {exp.logLines.map((line, li) => (
                <p
                  key={li}
                  style={{
                    color: line.startsWith('//') ? '#475569' : 'transparent',
                    fontSize: '0.8rem',
                    lineHeight: 1.7,
                    minHeight: line === '' ? '0.6rem' : undefined,
                  }}
                >
                  {line || '\u00A0'}
                </p>
              ))}
            </div>

            {/* Skills as diff +++ markers */}
            <div
              style={{
                marginLeft: '1rem',
                marginTop: '0.85rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
              }}
            >
              {exp.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    color: '#22c55e',
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.5rem',
                    background: 'rgba(34,197,94,0.07)',
                    borderRadius: '4px',
                  }}
                >
                  +++ {skill}
                </span>
              ))}
            </div>

            {/* Divider between commits */}
            {i < experiences.length - 1 && (
              <div
                style={{
                  height: '1px',
                  background: 'rgba(34,211,238,0.07)',
                  marginTop: '2rem',
                }}
              />
            )}
          </motion.div>
        ))}

        {/* Blinking cursor at end */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem' }}>
          <span style={{ color: accent, fontSize: '0.82rem' }}>$</span>
          <span
            style={{
              display: 'inline-block',
              width: '0.5rem',
              height: '1.1rem',
              background: accent,
              opacity: 0.7,
              animation: 'blink 1.1s step-end infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
