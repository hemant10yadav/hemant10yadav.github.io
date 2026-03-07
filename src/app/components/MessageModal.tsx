'use client';

import { motion } from 'framer-motion';
import { MessageForm } from './MessageForm';
import { ViewerType } from '../context/ViewerContext';

type Props = {
  onClose: () => void;
  viewerType: NonNullable<ViewerType>;
};

const CONTENT = {
  recruiter: {
    title: "Let's talk.",
    sub: "Tell me what you're building. I'll get back to you within 24 hours.",
    accent: '#f59e0b',
  },
  developer: {
    title: "Let's build something.",
    sub: "Drop a line. I'll reply — probably with opinions.",
    accent: '#22d3ee',
  },
};

export const MessageModal = ({ onClose, viewerType }: Props) => {
  const { title, sub, accent } = CONTENT[viewerType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      {/* Overlay click-to-close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-[440px] max-w-[92vw] rounded-2xl p-8"
        style={{
          background: '#0a0e1a',
          border: `1px solid ${accent}25`,
          boxShadow: `0 0 40px ${accent}12`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontSize: '1.1rem',
            lineHeight: 1,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#475569')}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2px',
              background: accent,
              marginBottom: '1rem',
              borderRadius: '2px',
            }}
          />
          <h3
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: '0.4rem',
            }}
          >
            {title}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{sub}</p>
        </div>

        <MessageForm viewerType={viewerType} accent={accent} />
      </motion.div>
    </div>
  );
};
