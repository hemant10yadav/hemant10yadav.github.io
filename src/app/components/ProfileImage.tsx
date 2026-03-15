'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProfileImageProps {
  profilePicUrl: string;
  size?: number;
  viewerType: 'recruiter' | 'developer';
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  profilePicUrl,
  size = 320,
  viewerType,
}) => {
  const isRecruiter = viewerType === 'recruiter';
  const accent = isRecruiter ? '#6ee7b7' : '#22d3ee';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      {/* Soft ambient glow behind image */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Accent ring */}
      <div
        style={{
          position: 'absolute',
          inset: '-3px',
          borderRadius: '50%',
          background: `conic-gradient(from 180deg, ${accent}50, transparent 40%, transparent 60%, ${accent}50)`,
          animation: 'spin 8s linear infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Dark ring gap */}
      <div
        style={{
          position: 'absolute',
          inset: '0px',
          borderRadius: '50%',
          background: '#080c14',
          pointerEvents: 'none',
        }}
      />

      {/* Image container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.06)',
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

        {/* Bottom fade to blend the yellow bg into dark */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(8,12,20,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.7rem',
          borderRadius: '999px',
          background: 'rgba(8,12,20,0.85)',
          border: `1px solid ${accent}35`,
          backdropFilter: 'blur(8px)',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: '0.4rem',
            height: '0.4rem',
            borderRadius: '50%',
            background: accent,
            display: 'block',
            boxShadow: `0 0 6px ${accent}`,
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
      </motion.div>
    </motion.div>
  );
};
