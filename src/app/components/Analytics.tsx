'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from 'nextjs-google-analytics';

const OPT_OUT_KEY = 'hy_analytics_opt_out';

// Personal opt-out: visit once with ?dnt=1 on a device (phone, laptop) to
// stop sending Google Analytics from it permanently — the flag persists in
// localStorage. Visit with ?dnt=0 to re-enable. Since window.gtag is only
// ever defined by <GoogleAnalytics> mounting, skipping it here also makes
// every event() call elsewhere in the app a silent no-op — nothing else
// needs to change.
export default function Analytics() {
  const [optedOut, setOptedOut] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dnt = params.get('dnt');
      if (dnt === '1') localStorage.setItem(OPT_OUT_KEY, 'true');
      else if (dnt === '0') localStorage.removeItem(OPT_OUT_KEY);
      setOptedOut(localStorage.getItem(OPT_OUT_KEY) === 'true');
    } catch {
      setOptedOut(false);
    }
  }, []);

  if (optedOut === null || optedOut) return null;
  return <GoogleAnalytics trackPageViews />;
}
