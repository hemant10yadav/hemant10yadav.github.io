'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SKIP_FLAG_KEY } from '../lib/visitorTracking';

export default function SkipPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      localStorage.setItem(SKIP_FLAG_KEY, 'true');
    } catch {
      /* ignore */
    }
    router.replace('/');
  }, [router]);

  return null;
}
