'use client';

import { useEffect, useState } from 'react';
import { COMMCARE_CONNECT, CONNECT_MERGED_PRS_FALLBACK, GITHUB_USERNAME } from '../constants';

const CACHE_KEY = 'hy_connect_merged_prs';
const CACHE_TTL = 60 * 60 * 1000; // 1 hr

const REPO = COMMCARE_CONNECT.repoUrl.replace('https://github.com/', '');
const QUERY = encodeURIComponent(`repo:${REPO} is:pr is:merged author:${GITHUB_USERNAME}`);

// Shared by every component that shows the count, so a page load makes one request.
let inflight: Promise<string | null> | null = null;

function fetchCount(): Promise<string | null> {
  inflight ??= fetch(`https://api.github.com/search/issues?q=${QUERY}&per_page=1`, {
    signal: AbortSignal.timeout(5000),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => (typeof data?.total_count === 'number' ? String(data.total_count) : null))
    .catch(() => null);
  return inflight;
}

/** Live count of merged commcare-connect PRs; shows the fallback until GitHub answers. */
export function useMergedPrCount(): string {
  const [count, setCount] = useState<string>(CONNECT_MERGED_PRS_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { value, fetchedAt } = JSON.parse(cached);
        if (Date.now() - fetchedAt < CACHE_TTL) {
          setCount(value);
          return;
        }
      }
    } catch { /* ignore */ }

    fetchCount().then((value) => {
      if (!value || cancelled) return;
      setCount(value);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ value, fetchedAt: Date.now() }));
      } catch { /* ignore */ }
    });

    return () => { cancelled = true; };
  }, []);

  return count;
}
