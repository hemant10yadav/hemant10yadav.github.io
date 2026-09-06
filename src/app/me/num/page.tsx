'use client';

import { Fragment, useEffect, useState } from 'react';
import {
  UPSTASH_URL, UPSTASH_TOKEN,
  UNIQUE_SET_KEY, TOTAL_COUNTER_KEY, LOG_LIST_KEY,
  SKIP_FLAG_KEY, ME_PASSWORD, VisitEntry,
} from '../../lib/visitorTracking';
import VisitorMap, { MapPoint } from './VisitorMap';

interface Stats {
  total: number;
  unique: number;
  log: VisitEntry[];
}

interface VisitorGroup {
  visitorId: string;
  count: number;
  lastTs: number;
  device: string;
  location: string;
  referrer: string;
  lat?: number;
  lon?: number;
  timestamps: number[]; // newest first
}

function formatLocation(entry: VisitEntry): string {
  if (entry.city && entry.country) return `${entry.city}, ${entry.country}`;
  if (entry.country) return entry.country;
  return entry.timezone;
}

function formatDateTime(ts: number): string {
  const date = new Date(ts);
  const datePart = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
  return `${datePart}, ${timePart} IST`;
}

function groupByVisitor(log: VisitEntry[]): VisitorGroup[] {
  const groups = new Map<string, VisitorGroup>();
  for (const entry of log) {
    const existing = groups.get(entry.visitorId);
    if (!existing) {
      groups.set(entry.visitorId, {
        visitorId: entry.visitorId,
        count: 1,
        lastTs: entry.ts,
        device: entry.device,
        location: formatLocation(entry),
        referrer: entry.referrer,
        lat: entry.lat,
        lon: entry.lon,
        timestamps: [entry.ts],
      });
    } else {
      existing.count += 1;
      existing.timestamps.push(entry.ts);
      if (entry.ts > existing.lastTs) {
        existing.lastTs = entry.ts;
        existing.device = entry.device;
        existing.location = formatLocation(entry);
        existing.referrer = entry.referrer;
        existing.lat = entry.lat;
        existing.lon = entry.lon;
      }
    }
  }
  const result = Array.from(groups.values());
  result.forEach((g) => g.timestamps.sort((a, b) => b - a));
  result.sort((a, b) => b.lastTs - a.lastTs);
  return result;
}

export default function MeStatsPage() {
  const [unlocked, setUnlocked] = useState(!ME_PASSWORD);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ME_PASSWORD) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  useEffect(() => {
    if (!unlocked) return;

    try {
      localStorage.setItem(SKIP_FLAG_KEY, 'true');
    } catch {
      /* ignore */
    }

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      setError('Upstash env vars not configured.');
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`${UPSTASH_URL}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ['LRANGE', LOG_LIST_KEY, '0', '99'],
            ['GET', TOTAL_COUNTER_KEY],
            ['SCARD', UNIQUE_SET_KEY],
          ]),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Array<{ result: unknown }> = await res.json();
        const rawLog = (data[0]?.result as string[]) ?? [];
        const total = Number(data[1]?.result ?? 0);
        const unique = Number(data[2]?.result ?? 0);

        const log: VisitEntry[] = rawLog
          .map((s) => {
            try {
              return JSON.parse(s) as VisitEntry;
            } catch {
              return null;
            }
          })
          .filter((e): e is VisitEntry => e !== null);

        setStats({ total, unique, log });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load stats.');
      }
    };

    load();
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          color: 'var(--fg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
        }}
      >
        <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '18rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--fg-3)' }}>password</label>
          <input
            type="password"
            autoFocus
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
            style={{
              background: 'var(--bg-input)',
              border: `1px solid ${passwordError ? '#f87171' : 'var(--border)'}`,
              borderRadius: '6px',
              padding: '0.6rem 0.8rem',
              color: 'var(--fg)',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          {passwordError && (
            <span style={{ color: '#f87171', fontSize: '0.75rem' }}>wrong password</span>
          )}
          <button
            type="submit"
            style={{
              background: 'var(--fg)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.6rem 0.8rem',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        color: 'var(--fg)',
        padding: '7rem 1.5rem 3rem',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
      }}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          visitor log
        </h1>
        <p style={{ color: 'var(--fg-3)', fontSize: '0.8rem', marginBottom: '2rem' }}>
          private — not linked from anywhere on the site
        </p>

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.85rem' }}>Error: {error}</p>
        )}

        {!error && !stats && (
          <p style={{ color: 'var(--fg-3)', fontSize: '0.85rem' }}>Loading…</p>
        )}

        {stats && (
          <>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
              }}
            >
              <Stat label="total views" value={stats.total} />
              <Stat label="unique visitors" value={stats.unique} />
              <Stat label="logged entries" value={stats.log.length} />
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border-2)', borderRadius: '8px', marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-chrome)', textAlign: 'left' }}>
                    {['visitor', 'visits', 'last seen', 'device', 'location', 'referrer'].map((h) => (
                      <th key={h} style={{ padding: '0.6rem 0.8rem', color: 'var(--fg-3)', fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupByVisitor(stats.log).map((g) => {
                    const isOpen = expanded === g.visitorId;
                    return (
                      <Fragment key={g.visitorId}>
                        <tr
                          onClick={() => setExpanded(isOpen ? null : g.visitorId)}
                          style={{ borderTop: '1px solid var(--border-3)', cursor: 'pointer' }}
                        >
                          <td style={{ padding: '0.5rem 0.8rem', color: 'var(--fg-3)' }}>
                            <span style={{ display: 'inline-block', width: '1rem' }}>{isOpen ? '▾' : '▸'}</span>
                            {g.visitorId.slice(0, 8)}
                          </td>
                          <td style={{ padding: '0.5rem 0.8rem' }}>{g.count}</td>
                          <td style={{ padding: '0.5rem 0.8rem', whiteSpace: 'nowrap' }}>{formatDateTime(g.lastTs)}</td>
                          <td style={{ padding: '0.5rem 0.8rem' }}>{g.device}</td>
                          <td style={{ padding: '0.5rem 0.8rem' }}>{g.location}</td>
                          <td style={{ padding: '0.5rem 0.8rem' }}>{g.referrer}</td>
                        </tr>
                        {isOpen && (
                          <tr style={{ borderTop: '1px solid var(--border-3)' }}>
                            <td colSpan={6} style={{ padding: '0.5rem 0.8rem 0.9rem 2.2rem', background: 'var(--bg-card)' }}>
                              <div style={{ color: 'var(--fg-3)', marginBottom: '0.4rem' }}>
                                all {g.timestamps.length} visit{g.timestamps.length === 1 ? '' : 's'}:
                              </div>
                              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {g.timestamps.map((ts, i) => (
                                  <li key={i} style={{ color: 'var(--fg-2)' }}>
                                    {formatDateTime(ts)}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                  {stats.log.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '1rem', color: 'var(--fg-3)', textAlign: 'center' }}>
                        no visits logged yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <VisitorMap
              points={groupByVisitor(stats.log)
                .filter((g): g is VisitorGroup & { lat: number; lon: number } => g.lat != null && g.lon != null)
                .map<MapPoint>((g) => ({ lat: g.lat, lon: g.lon, count: g.count, location: g.location }))}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--fg-3)' }}>{label}</div>
    </div>
  );
}
