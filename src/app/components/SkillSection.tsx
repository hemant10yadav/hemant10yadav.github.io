'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ViewerType } from '../context/ViewerContext';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRecruiter = viewerType === 'recruiter';
  const accent = isRecruiter ? '#6ee7b7' : '#22d3ee';

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
      ctx!.strokeStyle = isRecruiter
        ? 'rgba(110,231,183,0.12)'
        : 'rgba(34,211,238,0.12)';
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
        ctx!.fillStyle = isRecruiter
          ? 'rgba(110,231,183,0.3)'
          : 'rgba(34,211,238,0.3)';
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
      style={{ background: '#080c14' }}
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
            <p style={{ color: '#475569', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              with honest annotations
            </p>
          )}
        </motion.div>

        {isRecruiter ? (
          /* ── Recruiter: grouped by capability ─────────────────────────────── */
          <div className="space-y-14">
            {RECRUITER_GROUPS.map((group, gi) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: gi * 0.1 }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    color: accent,
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '1.25rem',
                    borderLeft: `2px solid ${accent}`,
                    paddingLeft: '0.75rem',
                  }}
                >
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-4 sm:gap-8">
                  {group.skills.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: si * 0.06, type: 'spring' }}
                      whileHover={{ scale: 1.12 }}
                    >
                      <div className="w-14 h-14 flex items-center justify-center">
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={52}
                          height={52}
                          className="rounded-xl"
                          style={{
                            filter: `drop-shadow(0 0 8px ${accent}40)`,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          color: '#94a3b8',
                          fontSize: '0.8rem',
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
                  background: 'rgba(255,255,255,0.03)',
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
                      color: '#e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {skill.name}
                  </p>
                  <p
                    style={{
                      color: '#475569',
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
          background: isRecruiter
            ? 'radial-gradient(circle at center, rgba(110,231,183,0.03), transparent 70%)'
            : 'radial-gradient(circle at center, rgba(34,211,238,0.03), transparent 70%)',
        }}
      />
    </section>
  );
}
