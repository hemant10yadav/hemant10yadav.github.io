'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useViewer } from '../context/ViewerContext';

const CARDS = [
  {
    icon: '🔥',
    id: 'pulse',
    title: 'Pulse',
    desc: 'Live tech briefing — HN, GitHub trending, npm spikes, tech temperature.',
  },
  {
    icon: '>_',
    id: 'terminal',
    title: 'Terminal',
    desc: "Interactive CLI. Type 'help' to start. Some commands have surprises.",
  },
];

export default function LabTeaser() {
  const { accent } = useViewer();

  return (
    <section
      style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem) 1.5rem clamp(3rem, 8vw, 6rem)',
      }}
    >
      {/* Divider line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${accent}30, transparent)`,
          marginBottom: 'clamp(2rem, 5vw, 3.5rem)',
          transformOrigin: 'left',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
      >
        {/* Prompt label */}
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.75rem',
            color: 'var(--fg-5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ color: accent }}>$</span>
          <span>cd /lab</span>
          <span
            style={{
              display: 'inline-block',
              width: '0.4rem',
              height: '0.85rem',
              background: accent,
              opacity: 0.6,
              animation: 'blink 1.1s step-end infinite',
              marginLeft: '2px',
            }}
          />
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: '1rem',
            width: '100%',
            maxWidth: '560px',
          }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ borderColor: `${accent}35`, y: -2 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-2)',
                borderRadius: '10px',
                padding: '1.25rem',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.7rem',
                  marginBottom: '0.1rem',
                }}
              >
                <span style={{ marginRight: '0.4rem' }}>{card.icon}</span>
                <span style={{ color: accent }}>{card.title}</span>
              </div>
              <p
                style={{
                  color: 'var(--fg-4)',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  marginTop: '0.35rem',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                }}
              >
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/lab" passHref>
            <motion.span
              whileHover={{ x: 4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.85rem',
                color: accent,
                cursor: 'pointer',
                textDecoration: 'none',
                padding: '0.6rem 1.4rem',
                borderRadius: '8px',
                border: `1px solid ${accent}30`,
                background: `${accent}08`,
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `${accent}14`;
                el.style.borderColor = `${accent}50`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `${accent}08`;
                el.style.borderColor = `${accent}30`;
              }}
            >
              Open the lab →
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
