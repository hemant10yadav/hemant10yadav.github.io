'use client';

import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProfileImageProps {
  profilePicUrl: string;
  size?: number;
  viewerType: 'recruiter' | 'developer';
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  profilePicUrl,
  size = 340,
  viewerType,
}) => {
  return viewerType === 'recruiter' ? (
    <RecruiterFrame profilePicUrl={profilePicUrl} size={size} />
  ) : (
    <DeveloperFrame profilePicUrl={profilePicUrl} size={size} />
  );
};

// ── Recruiter: ID-card style with amber corner brackets ───────────────────────

function RecruiterFrame({
  profilePicUrl,
  size,
}: {
  profilePicUrl: string;
  size: number;
}) {
  const accent = '#f59e0b';
  const [scanning, setScanning] = useState(false);

  // Start scan sweep every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setScanning(true);
      setTimeout(() => setScanning(false), 900);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const cornerSize = 20;
  const cornerThick = 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      {/* Outer glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-12px',
          borderRadius: '16px',
          background: `radial-gradient(ellipse at center, ${accent}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Main image container — rounded-square */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#0a0e1a',
        }}
      >
        <Image
          src={profilePicUrl}
          alt="Hemant Singh Yadav"
          fill
          className="object-cover"
          priority
          draggable={false}
          style={{ objectPosition: 'center top' }}
        />

        {/* Scan-line sweep */}
        <motion.div
          animate={scanning ? { top: ['0%', '100%'], opacity: [0, 0.4, 0] } : {}}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            top: '0%',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0.75rem 1rem',
            background: 'linear-gradient(0deg, rgba(8,12,20,0.95) 60%, transparent)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                color: '#e2e8f0',
                fontSize: '0.78rem',
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              Hemant Singh Yadav
            </p>
            <p
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                color: '#64748b',
                fontSize: '0.65rem',
                lineHeight: 1.3,
              }}
            >
              Software Engineer
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '999px',
              background: `${accent}20`,
              border: `1px solid ${accent}40`,
            }}
          >
            <span
              style={{
                width: '0.4rem',
                height: '0.4rem',
                borderRadius: '50%',
                background: accent,
                display: 'block',
                boxShadow: `0 0 5px ${accent}`,
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                color: accent,
                fontSize: '0.6rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      {[
        { top: 0, left: 0, borderTop: cornerThick, borderLeft: cornerThick },
        { top: 0, right: 0, borderTop: cornerThick, borderRight: cornerThick },
        { bottom: 0, left: 0, borderBottom: cornerThick, borderLeft: cornerThick },
        { bottom: 0, right: 0, borderBottom: cornerThick, borderRight: cornerThick },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: cornerSize,
            height: cornerSize,
            borderColor: accent,
            borderStyle: 'solid',
            borderWidth: 0,
            ...Object.fromEntries(
              Object.entries(pos)
                .filter(([k]) => k.startsWith('border'))
                .map(([k, v]) => [k, `${v}px`]),
            ),
            ...Object.fromEntries(
              Object.entries(pos)
                .filter(([k]) => !k.startsWith('border'))
                .map(([k, v]) => [k, `${Number(v) - 1}px`]),
            ),
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.div>
  );
}

// ── Developer: terminal window + draggable + floating code badges ─────────────

const CODE_BADGES = [
  { text: '// available for cool projects', x: -48, y: 20 },
  { text: '/* ships on time */', x: -32, y: 280 },
  { text: '> git status: clean', x: 200, y: -18 },
];

function DeveloperFrame({
  profilePicUrl,
  size,
}: {
  profilePicUrl: string;
  size: number;
}) {
  const accent = '#22d3ee';
  const controls = useAnimation();
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 5 }, () => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
      })),
    );
  }, []);

  const imgSize = size - 0; // full size for the content

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'relative', width: size, height: size + 32 }}
    >
      {/* Floating code comment badges */}
      {CODE_BADGES.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
          style={{
            position: 'absolute',
            left: badge.x,
            top: badge.y,
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.65rem',
            color: '#475569',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {badge.text}
        </motion.div>
      ))}

      {/* Terminal frame — draggable */}
      <motion.div
        drag
        dragElastic={0.25}
        dragMomentum={false}
        whileTap={{ cursor: 'grabbing' }}
        onDragEnd={() =>
          controls.start({
            x: 0,
            y: 0,
            transition: { type: 'spring', stiffness: 280, damping: 22 },
          })
        }
        animate={controls}
        style={{
          position: 'relative',
          width: imgSize,
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${accent}30`,
          cursor: 'grab',
          boxShadow: `0 0 30px ${accent}14`,
          zIndex: 1,
        }}
      >
        {/* Terminal chrome */}
        <div
          style={{
            background: '#111827',
            padding: '0.5rem 0.85rem',
            borderBottom: `1px solid ${accent}18`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
            <span
              key={c}
              style={{
                width: '0.55rem',
                height: '0.55rem',
                borderRadius: '50%',
                background: c,
                display: 'block',
                opacity: 0.8,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.68rem',
              color: '#475569',
              marginLeft: '0.3rem',
            }}
          >
            hemant@portfolio: ~
          </span>
        </div>

        {/* Image area */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
          <Image
            src={profilePicUrl}
            alt="Hemant Singh Yadav"
            fill
            className="object-cover"
            priority
            draggable={false}
            style={{ objectPosition: 'center top' }}
          />

          {/* Scanlines overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)',
              pointerEvents: 'none',
            }}
          />

          {/* Floating particles */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                top: `${p.y}%`,
                left: `${p.x}%`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: accent,
                opacity: 0.4,
              }}
              animate={{ y: [0, -7, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 3 + i * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Terminal footer */}
        <div
          style={{
            background: '#0a0e1a',
            borderTop: `1px solid ${accent}14`,
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span style={{ color: accent, fontFamily: 'monospace', fontSize: '0.72rem' }}>$</span>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.72rem',
              color: '#475569',
            }}
          >
            whoami
          </span>
          <span
            style={{
              marginLeft: '0.3rem',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.72rem',
              color: '#e2e8f0',
            }}
          >
            hemant_singh_yadav
          </span>
          <span
            style={{
              display: 'inline-block',
              width: '0.45rem',
              height: '0.9rem',
              background: accent,
              opacity: 0.7,
              marginLeft: '2px',
              animation: 'blink 1.1s step-end infinite',
              flexShrink: 0,
            }}
          />
        </div>
      </motion.div>

      {/* Drag hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '0.65rem',
          color: '#334155',
          textAlign: 'center',
          marginTop: '0.5rem',
        }}
      >
        {'// drag me'}
      </motion.p>
    </motion.div>
  );
}
