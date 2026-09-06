export const UPSTASH_URL = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
export const UPSTASH_TOKEN = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

export const VISITOR_ID_KEY = 'hy_visitor_id';
export const SKIP_FLAG_KEY = 'hy_skip_counter';

export const ME_PASSWORD = process.env.NEXT_PUBLIC_ME_PASSWORD;

export const UNIQUE_SET_KEY = 'visits:unique';
export const TOTAL_COUNTER_KEY = 'visits:total';
export const LOG_LIST_KEY = 'visits:log';
export const LOG_MAX_LEN = 500;

export interface VisitEntry {
  ts: number;
  visitorId: string;
  referrer: string;
  timezone: string;
  device: 'mobile' | 'desktop';
  isNew: boolean;
  city?: string;
  country?: string;
  lat?: number;
  lon?: number;
}

export function getVisitorId(): { id: string; isNew: boolean } {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return { id: existing, isNew: false };
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
    return { id, isNew: true };
  } catch {
    return { id: crypto.randomUUID(), isNew: true };
  }
}

export function getReferrer(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'direct';
  try {
    return new URL(document.referrer).hostname || 'direct';
  } catch {
    return 'direct';
  }
}

export function getDevice(): 'mobile' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop';
  return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

export function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'unknown';
  }
}

export async function getGeo(): Promise<{ city?: string; country?: string; lat?: number; lon?: number }> {
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return {};
    const data = await res.json();
    if (!data.success) return {};
    return { city: data.city, country: data.country, lat: data.latitude, lon: data.longitude };
  } catch {
    return {};
  }
}

export function isSkipped(): boolean {
  //return false; // to test only
  try {
    if (localStorage.getItem(SKIP_FLAG_KEY) === 'true') return true;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/me')) return true;
  return false;
}
