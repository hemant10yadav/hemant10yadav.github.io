'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewer } from '../context/ViewerContext';
import {
  UPSTASH_URL, UPSTASH_TOKEN,
  UNIQUE_SET_KEY, TOTAL_COUNTER_KEY, LOG_LIST_KEY, LOG_MAX_LEN,
  getVisitorId, getReferrer, getDevice, getTimezone, getGeo, isSkipped,
  VisitEntry,
} from '../lib/visitorTracking';

interface Counts {
  unique: number;
  total: number;
}

export default function VisitorCounter() {
  const { accent } = useViewer();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
    if (isSkipped()) return;

    let cancelled = false;

    const run = async () => {
      try {
        const { id: visitorId, isNew } = getVisitorId();
        const geo = await getGeo();
        const entry: VisitEntry = {
          ts: Date.now(),
          visitorId,
          referrer: getReferrer(),
          timezone: getTimezone(),
          device: getDevice(),
          isNew,
          city: geo.city,
          country: geo.country,
          lat: geo.lat,
          lon: geo.lon,
        };

        const res = await fetch(`${UPSTASH_URL}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ['SADD', UNIQUE_SET_KEY, visitorId],
            ['INCR', TOTAL_COUNTER_KEY],
            ['SCARD', UNIQUE_SET_KEY],
            ['LPUSH', LOG_LIST_KEY, JSON.stringify(entry)],
            ['LTRIM', LOG_LIST_KEY, '0', String(LOG_MAX_LEN - 1)],
          ]),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return;

        const data: Array<{ result: number }> = await res.json();
        const total = data[1]?.result ?? 0;
        const unique = data[2]?.result ?? 0;
        if (!cancelled) setCounts({ unique, total });
      } catch {
        /* network error or rate limit — stay hidden */
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  if (!counts) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1 }}
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '2rem',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.75rem',
          borderRadius: '999px',
          maxWidth: 'calc(100vw - 2rem)',
          background: 'var(--bg-overlay)',
          border: `1px solid ${accent}30`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.7rem',
            color: 'var(--fg-2)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {counts.unique.toLocaleString()} visitors · {counts.total.toLocaleString()} views
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
