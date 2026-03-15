'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ViewerType, useViewer } from '../context/ViewerContext';

interface SkillSectionProps {
  viewerType: NonNullable<ViewerType>;
}

// ── recruiter view: skills grouped by capability ──────────────────────────────

const RECRUITER_GROUPS = [
  {
    label: 'Backend Systems',
    skills: [
      { name: 'Python', icon: '/assets/python.png' },
      { name: 'Django', icon: '/assets/django.png' },
      { name: 'Java', icon: '/assets/java.png' },
      { name: 'Spring Boot', icon: '/assets/spring.png' },
    ],
  },
  {
    label: 'Frontend Delivery',
    skills: [
      { name: 'React', icon: '/assets/react.png' },
      { name: 'Angular', icon: '/assets/angular.png' },
      { name: 'TypeScript', icon: '/assets/typescript.png' },
      { name: 'Tailwind', icon: '/assets/Tailwind.png' },
    ],
  },
  {
    label: 'Infrastructure',
    skills: [
      { name: 'AWS', icon: '/assets/aws.png' },
      { name: 'Docker', icon: '/assets/python.png' },
      { name: 'PostgreSQL', icon: '/assets/postgres.png' },
      { name: 'MongoDB', icon: '/assets/mongo.png' },
    ],
  },
];

// ── developer view: individual skills with honest depth notes ──────────────────

const DEVELOPER_SKILLS: Array<{
  name: string;
  icon: string;
  note: string;
}> = [
  { name: 'Django', icon: '/assets/python.png', note: 'Where I live. 2 years deep.' },
  { name: 'Python', icon: '/assets/python.png', note: 'First language I actually liked.' },
  { name: 'Spring Boot', icon: '/assets/spring.png', note: 'Enterprise APIs. Hibernate made me cry once.' },
  { name: 'React', icon: '/assets/react.png', note: 'I understand hooks now. Took a while.' },
  { name: 'Angular', icon: '/assets/angular.png', note: 'RxJS and I have a complicated relationship.' },
  { name: 'TypeScript', icon: '/assets/typescript.png', note: 'Once you go typed, you never go back.' },
  { name: 'PostgreSQL', icon: '/assets/postgres.png', note: 'Indexes are magic. Write the query plan.' },
  { name: 'AWS', icon: '/assets/aws.png', note: 'S3, EC2. Still afraid of billing alerts.' },
  { name: 'Docker', icon: '/assets/python.png', note: '"Works on my machine" — now ships everywhere.' },
  { name: 'MongoDB', icon: '/assets/mongo.png', note: 'Schema-less, until you wish you had one.' },
  { name: 'Git', icon: '/assets/git.png', note: 'git blame → git shame → git fix.' },
  { name: 'Node.js', icon: '/assets/node.png', note: 'Async all the way down.' },
];

export default function SkillSection({ viewerType }: SkillSectionProps) {
  const { accent } = useViewer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRecruiter = viewerType === 'recruiter';

  // ── animated constellation background ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    }));

    let rafId: number;

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.strokeStyle = `${accent}1f`;
      ctx!.lineWidth = 0.5;

      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          if (dx * dx + dy * dy < 10000) {
            ctx!.beginPath();
            ctx!.moveTo(s1.x, s1.y);
            ctx!.lineTo(s2.x, s2.y);
            ctx!.stroke();
          }
        }
      }

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0 || s.x > canvas!.width) s.dx *= -1;
        if (s.y < 0 || s.y > canvas!.height) s.dy *= -1;

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `${accent}4d`;
        ctx!.fill();
      });

      rafId = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, [isRecruiter]);

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          key={viewerType}
          initial={{ opacity: 0, y: -16 }}
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
            {isRecruiter ? 'What I bring to your team' : 'What I actually know'}
          </h2>
          {!isRecruiter && (
            <p style={{ color: 'var(--fg-4)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              with honest annotations
            </p>
          )}
        </motion.div>

        {isRecruiter ? (
          /* ── Recruiter: capability cards ────────────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECRUITER_GROUPS.map((group, gi) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: gi * 0.12 }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-2)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {/* Card header accent bar + label */}
                <div
                  style={{
                    borderBottom: '1px solid var(--border-2)',
                    padding: '1rem 1.25rem 0.9rem',
                    background: `linear-gradient(135deg, ${accent}10, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      style={{
                        width: '3px',
                        height: '18px',
                        borderRadius: '2px',
                        background: accent,
                        flexShrink: 0,
                      }}
                    />
                    <h3
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        color: accent,
                        fontSize: '0.72rem',
                        letterSpacing: '0.13em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {group.label}
                    </h3>
                  </div>
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--border-3)' }}>
                  {group.skills.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: gi * 0.12 + si * 0.07 }}
                      whileHover={{ background: `${accent}0d` }}
                      className="flex items-center gap-3"
                      style={{
                        padding: '0.875rem 1rem',
                        background: 'var(--bg-surface)',
                        cursor: 'default',
                        transition: 'background 0.2s',
                      }}
                    >
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={30}
                        height={30}
                        className="rounded-md flex-shrink-0"
                        style={{ filter: `drop-shadow(0 0 6px ${accent}30)` }}
                      />
                      <span
                        style={{
                          color: 'var(--fg-2)',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          lineHeight: 1.2,
                        }}
                      >
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* ── Developer: individual skills with honest notes ─────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEVELOPER_SKILLS.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(34,211,238,0.1)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'border-color 0.2s',
                }}
                onHoverStart={(e) => {
                  const el = e.target as HTMLElement;
                  el.style.borderColor = 'rgba(34,211,238,0.3)';
                }}
                onHoverEnd={(e) => {
                  const el = e.target as HTMLElement;
                  el.style.borderColor = 'rgba(34,211,238,0.1)';
                }}
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={36}
                  height={36}
                  className="rounded-lg flex-shrink-0 mt-0.5"
                />
                <div>
                  <p
                    style={{
                      color: 'var(--fg)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {skill.name}
                  </p>
                  <p
                    style={{
                      color: 'var(--fg-4)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      lineHeight: 1.5,
                    }}
                  >
                    {skill.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Faint glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accent}08, transparent 70%)`,
        }}
      />
    </section>
  );
}
