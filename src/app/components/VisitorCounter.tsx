'use client';

import { useEffect } from 'react';
import {
  UPSTASH_URL, UPSTASH_TOKEN,
  UNIQUE_SET_KEY, TOTAL_COUNTER_KEY, LOG_LIST_KEY, LOG_MAX_LEN,
  getVisitorId, getReferrer, getDevice, getTimezone, getGeo, isSkipped,
  VisitEntry,
} from '../lib/visitorTracking';

// Records the visit for the /me/num stats page. Renders nothing: a public
// counter with small numbers works against the page.
export default function VisitorCounter() {
  useEffect(() => {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
    if (isSkipped()) return;

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

        await fetch(`${UPSTASH_URL}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ['SADD', UNIQUE_SET_KEY, visitorId],
            ['INCR', TOTAL_COUNTER_KEY],
            ['LPUSH', LOG_LIST_KEY, JSON.stringify(entry)],
            ['LTRIM', LOG_LIST_KEY, '0', String(LOG_MAX_LEN - 1)],
          ]),
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        /* network error or rate limit — the visit just goes unrecorded */
      }
    };

    run();
  }, []);

  return null;
}
