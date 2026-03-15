'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { useViewer } from '../context/ViewerContext';
import Pulse from '../components/Pulse';
import CLITerminal from '../components/CLITerminal';

export default function LabPage() {
  const { accent, ready } = useViewer();

  if (!ready) {
    return <div className="min-h-screen" style={{ background: '#080c14' }} />;
  }

  return (
    <>
      <GoogleAnalytics trackPageViews />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen text-white"
        style={{ background: "#080c14" }}
      >
        <main className="pt-20">
          {/* Page header */}
          <div
            style={{
              maxWidth: "72rem",
              margin: "0 auto",
              padding: "clamp(1.5rem, 4vw, 3rem) 1.5rem 0",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: accent,
                    fontSize: "0.8rem",
                  }}
                >
                  ~/
                </span>
                <h1
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "clamp(1.4rem, 4vw, 2rem)",
                    fontWeight: 700,
                    color: "#e2e8f0",
                    margin: 0,
                  }}
                >
                  lab
                </h1>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "#475569",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  experiments
                </span>
              </div>

              <Link href="/" passHref>
                <motion.span
                  whileHover={{ x: -3 }}
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "0.75rem",
                    color: "#475569",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = accent)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#475569")
                  }
                >
                  ← back to portfolio
                </motion.span>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "#334155",
                fontSize: "0.75rem",
                marginTop: "0.6rem",
              }}
            >
              Not the pitch. Just the fun stuff.
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                height: "1px",
                background: `linear-gradient(90deg, ${accent}30, transparent 60%)`,
                marginTop: "1.5rem",
                transformOrigin: "left",
              }}
            />
          </div>
          <CLITerminal />
          <Pulse />
          {/* Bottom padding */}
          <div style={{ height: "4rem" }} />
        </main>
      </motion.div>
    </>
  );
}
