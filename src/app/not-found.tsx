'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useViewer } from './context/ViewerContext';

const FILES = ['about', 'skills', 'projects', 'lab', '.mistakes', '.git'];

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const { accent, viewerType } = useViewer();
  const [lineIndex, setLineIndex] = useState(0);

  const isRecruiter = viewerType === 'recruiter';

  const lines = [
    { cmd: `cd ${pathname}`, output: `bash: cd: ${pathname}: No such file or directory` },
    { cmd: 'ls -la /', output: FILES.join('  ') },
    {
      cmd: null,
      output: isRecruiter
        ? "That page doesn't exist — but the rest of the site does."
        : "404. Either it never existed, or I broke it and forgot. 50/50, honestly.",
    },
  ];

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    const t = setTimeout(() => setLineIndex((i) => i + 1), lineIndex === 0 ? 400 : 550);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') router.push('/');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '38rem',
          background: '#0b1120',
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${accent}30`,
          boxShadow: `0 0 0 1px ${accent}15, 0 24px 60px rgba(0,0,0,0.6)`,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
        }}
      >
        {/* Chrome */}
        <div
          style={{
            background: '#141c2e',
            padding: '0.65rem 1rem',
            borderBottom: `1px solid ${accent}18`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            userSelect: 'none',
          }}
        >
          {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
            <span key={c} style={{ width: '0.55rem', height: '0.55rem', borderRadius: '50%', background: c, display: 'block', opacity: 0.8 }} />
          ))}
          <span style={{ fontSize: '0.68rem', color: '#334155', marginLeft: '0.4rem' }}>
            visitor@hemant — 404
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem 1.5rem', minHeight: '14rem' }}>
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              lineHeight: 1,
              color: `${accent}`,
              opacity: 0.9,
              marginBottom: '1rem',
            }}
          >
            404
          </div>

          {lines.slice(0, lineIndex).map((line, i) => (
            <div key={i} style={{ marginBottom: '0.6rem' }}>
              {line.cmd && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.2rem', fontSize: '0.82rem' }}>
                  <span style={{ color: accent }}>visitor@hemant</span>
                  <span style={{ color: 'var(--fg-4)' }}>~$</span>
                  <span style={{ color: 'var(--fg)' }}>{line.cmd}</span>
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: 'var(--fg-3)', whiteSpace: 'pre-wrap' }}>
                {line.output}
              </div>
            </div>
          ))}

          {lineIndex >= lines.length && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', marginTop: '0.75rem' }}>
              <span style={{ color: accent }}>visitor@hemant</span>
              <span style={{ color: 'var(--fg-4)' }}>~$</span>
              <Link
                href="/"
                style={{
                  color: 'var(--fg)',
                  textDecoration: 'underline',
                  textDecorationColor: `${accent}60`,
                  textUnderlineOffset: '3px',
                }}
              >
                cd ~
              </Link>
              <span style={{ width: '0.5rem', height: '1rem', background: accent, opacity: 0.7, animation: 'blink 1s step-end infinite' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
