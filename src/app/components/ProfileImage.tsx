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
    </motion.div>
  );
};
