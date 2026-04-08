'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useViewer } from '../context/ViewerContext';
import { FULL_NAME } from '../constants';

interface ProfileImageProps {
  profilePicUrl: string;
  size?: number;
  viewerType: 'recruiter' | 'developer';
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  profilePicUrl,
  size = 320,
}) => {
  const { accent } = useViewer();

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
          inset: '-15%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}0e 0%, transparent 70%)`,
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
          border: `2px solid ${accent}35`,
          boxShadow: `0 0 0 4px ${accent}08, 0 0 28px ${accent}18`,
        }}
      >
        <Image
          src={profilePicUrl}
          alt={FULL_NAME}
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
            background: 'linear-gradient(180deg, transparent 40%, var(--bg) 100%)',
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
          background: 'var(--bg-overlay)',
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
