'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewer } from '../context/ViewerContext';

// ── types ────────────────────────────────────────────────────────────────────

interface WeatherInfo {
  temp: number;
  code: number;
  isDay: boolean;
  city: string | null;
  fetchedAt: number;
}

interface Condition {
  bucket: 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';
  label: string;
  emoji: string;
}

const CACHE_KEY = 'hy_weather_ambient';
const CACHE_TTL = 30 * 60 * 1000; // 30 min

// Developer-only presets for previewing each condition without waiting on
// real geolocation/weather. Only rendered when the DEV env var is 'true'.
interface WeatherPreset { key: string; label: string; code: number; isDay: boolean; temp: number; }

const DEV_PRESETS: WeatherPreset[] = [
  { key: 'clear-day',   label: 'Clear day',   code: 0,  isDay: true,  temp: 28 },
  { key: 'clear-night', label: 'Clear night', code: 0,  isDay: false, temp: 18 },
  { key: 'cloudy',      label: 'Cloudy',      code: 3,  isDay: true,  temp: 24 },
  { key: 'fog',         label: 'Fog',         code: 45, isDay: true,  temp: 14 },
  { key: 'rain',        label: 'Rain',        code: 61, isDay: true,  temp: 20 },
  { key: 'snow',        label: 'Snow',        code: 71, isDay: true,  temp: -2 },
  { key: 'storm',       label: 'Storm',       code: 95, isDay: false, temp: 22 },
];

// ── data fetching ────────────────────────────────────────────────────────────

async function fetchWeather(lat: number, lon: number): Promise<{ temp: number; code: number; isDay: boolean }> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`,
    { signal: AbortSignal.timeout(6000) },
  );
  if (!res.ok) throw new Error('weather fetch failed');
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
    isDay: data.current.is_day === 1,
  };
}

async function fetchCityName(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || null;
  } catch {
    return null;
  }
}

function classify(code: number, isDay: boolean): Condition {
  if (code === 0) return { bucket: 'clear', label: isDay ? 'Clear' : 'Clear night', emoji: isDay ? '☀️' : '🌙' };
  if ([1, 2, 3].includes(code)) return { bucket: 'cloudy', label: 'Cloudy', emoji: '☁️' };
  if ([45, 48].includes(code)) return { bucket: 'fog', label: 'Foggy', emoji: '🌫️' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { bucket: 'rain', label: 'Rainy', emoji: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { bucket: 'snow', label: 'Snowy', emoji: '❄️' };
  if ([95, 96, 99].includes(code)) return { bucket: 'storm', label: 'Stormy', emoji: '⛈️' };
  return { bucket: 'cloudy', label: 'Overcast', emoji: '☁️' };
}

const SKY_WASH: Record<Condition['bucket'], { day: string; night: string }> = {
  clear: { day: 'radial-gradient(ellipse at top, rgba(251,191,36,0.05), transparent 60%)', night: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06), transparent 60%)' },
  cloudy: { day: 'radial-gradient(ellipse at top, rgba(148,163,184,0.05), transparent 60%)', night: 'radial-gradient(ellipse at top, rgba(100,116,139,0.06), transparent 60%)' },
  fog: { day: 'radial-gradient(ellipse at top, rgba(203,213,225,0.06), transparent 65%)', night: 'radial-gradient(ellipse at top, rgba(148,163,184,0.05), transparent 65%)' },
  rain: { day: 'radial-gradient(ellipse at top, rgba(56,120,182,0.06), transparent 60%)', night: 'radial-gradient(ellipse at top, rgba(30,64,110,0.08), transparent 60%)' },
  snow: { day: 'radial-gradient(ellipse at top, rgba(224,242,254,0.06), transparent 65%)', night: 'radial-gradient(ellipse at top, rgba(186,230,253,0.05), transparent 65%)' },
  storm: { day: 'radial-gradient(ellipse at top, rgba(76,29,149,0.07), transparent 60%)', night: 'radial-gradient(ellipse at top, rgba(49,19,97,0.09), transparent 60%)' },
};

// ── particle systems ─────────────────────────────────────────────────────────

interface RainDrop { x: number; y: number; len: number; speed: number; opacity: number; }
interface SnowFlake { x: number; y: number; r: number; speed: number; drift: number; phase: number; }
interface CloudPuff { dx: number; dy: number; r: number; }
interface CloudBlob { x: number; y: number; scale: number; speed: number; opacity: number; puffs: CloudPuff[]; }

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// A cloud is a small cluster of overlapping soft puffs (classic cumulus
// silhouette) rather than a single blurry ellipse — reads as a cloud shape
// instead of a smear.
const CLOUD_TEMPLATE: CloudPuff[] = [
  { dx: -38, dy: 10, r: 20 },
  { dx: -16, dy: -6, r: 25 },
  { dx: 10, dy: -10, r: 27 },
  { dx: 34, dy: -1, r: 21 },
  { dx: 50, dy: 10, r: 15 },
  { dx: 0, dy: 15, r: 23 },
  { dx: -22, dy: 16, r: 17 },
];

function makeRain(width: number, height: number, density: number): RainDrop[] {
  return Array.from({ length: density }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    len: 14 + Math.random() * 16,
    speed: 6 + Math.random() * 6,
    opacity: 0.25 + Math.random() * 0.35,
  }));
}

function makeSnow(width: number, height: number, density: number): SnowFlake[] {
  return Array.from({ length: density }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1.5 + Math.random() * 2.5,
    speed: 0.6 + Math.random() * 1.2,
    drift: 0.3 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
  }));
}

function makeClouds(width: number, height: number, count: number): CloudBlob[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (width / count) * i + Math.random() * 100,
    y: height * (0.03 + Math.random() * 0.08),
    scale: 0.6 + Math.random() * 0.5,
    speed: 0.12 + Math.random() * 0.16,
    opacity: 0.06 + Math.random() * 0.05,
    puffs: CLOUD_TEMPLATE,
  }));
}

function drawCloudBlob(ctx: CanvasRenderingContext2D, c: CloudBlob, color: string) {
  c.puffs.forEach((p) => {
    const px = c.x + p.dx * c.scale;
    const py = c.y + p.dy * c.scale;
    const r = p.r * c.scale;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
    grad.addColorStop(0, hexToRgba(color, c.opacity));
    grad.addColorStop(0.7, hexToRgba(color, c.opacity * 0.5));
    grad.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ── component ─────────────────────────────────────────────────────────────────

export default function WeatherAmbient({ devMode = false }: { devMode?: boolean }) {
  const { colorMode, accent } = useViewer();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [override, setOverride] = useState<WeatherPreset | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ rain?: RainDrop[]; snow?: SnowFlake[]; clouds?: CloudBlob[] }>({});
  const flashRef = useRef({ next: 3000 + Math.random() * 4000, elapsed: 0, alpha: 0 });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: WeatherInfo = JSON.parse(cached);
          if (Date.now() - parsed.fetchedAt < CACHE_TTL) {
            if (!cancelled) setWeather(parsed);
            return;
          }
        }
      } catch { /* ignore */ }

      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const [current, city] = await Promise.all([
              fetchWeather(latitude, longitude),
              fetchCityName(latitude, longitude),
            ]);
            const info: WeatherInfo = { ...current, city, fetchedAt: Date.now() };
            try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(info)); } catch { /* ignore */ }
            if (!cancelled) setWeather(info);
          } catch { /* silently skip — keep whatever is currently shown */ }
        },
        () => { /* permission denied or unavailable — keep whatever is currently shown */ },
        { timeout: 8000, maximumAge: CACHE_TTL },
      );
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const effective: WeatherInfo | null = override
    ? { temp: override.temp, code: override.code, isDay: override.isDay, city: null, fetchedAt: Date.now() }
    : weather;
  const condition = effective ? classify(effective.code, effective.isDay) : null;
  const bucket = condition?.bucket;

  // particle animation
  useEffect(() => {
    if (!bucket) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = window.innerWidth, h = window.innerHeight;
      if (bucket === 'rain') particlesRef.current.rain = makeRain(w, h, 90);
      else if (bucket === 'storm') particlesRef.current.rain = makeRain(w, h, 140);
      else if (bucket === 'snow') particlesRef.current.snow = makeSnow(w, h, 90);
      else if (bucket === 'cloudy' || bucket === 'fog') particlesRef.current.clouds = makeClouds(w, h, bucket === 'fog' ? 9 : 7);
    };
    resize();
    window.addEventListener('resize', resize);

    const rainColor = colorMode === 'dark' ? 'rgba(186,230,253,' : 'rgba(30,64,175,';
    const snowColor = colorMode === 'dark' ? 'rgba(255,255,255,' : 'rgba(100,116,139,';
    const cloudColor = colorMode === 'dark' ? '#94a3b8' : '#64748b';

    let frame: number;
    let lastT = performance.now();

    const render = (t: number) => {
      const dt = t - lastT;
      lastT = t;
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if ((bucket === 'rain' || bucket === 'storm') && particlesRef.current.rain) {
        ctx.lineCap = 'round';
        particlesRef.current.rain.forEach((d) => {
          d.y += d.speed;
          d.x -= d.speed * 0.25;
          if (d.y > h) { d.y = -d.len; d.x = Math.random() * w; }
          ctx.strokeStyle = `${rainColor}${d.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.len * 0.25, d.y + d.len);
          ctx.stroke();
        });

        if (bucket === 'storm') {
          flashRef.current.elapsed += dt;
          if (flashRef.current.elapsed > flashRef.current.next) {
            flashRef.current.elapsed = 0;
            flashRef.current.next = 4000 + Math.random() * 6000;
            flashRef.current.alpha = 0.25;
          }
          if (flashRef.current.alpha > 0) {
            ctx.fillStyle = `rgba(255,255,255,${flashRef.current.alpha})`;
            ctx.fillRect(0, 0, w, h);
            flashRef.current.alpha -= 0.02;
          }
        }
      }

      if (bucket === 'snow' && particlesRef.current.snow) {
        particlesRef.current.snow.forEach((f) => {
          f.y += f.speed;
          f.phase += 0.02;
          f.x += Math.sin(f.phase) * f.drift * 0.3;
          if (f.y > h) { f.y = -f.r; f.x = Math.random() * w; }
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = `${snowColor}0.8)`;
          ctx.fill();
        });
      }

      if ((bucket === 'cloudy' || bucket === 'fog') && particlesRef.current.clouds) {
        particlesRef.current.clouds.forEach((c) => {
          c.x += c.speed;
          const halfSpan = 60 * c.scale;
          if (c.x - halfSpan > w) c.x = -halfSpan;
          drawCloudBlob(ctx, c, cloudColor);
        });
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, [bucket, colorMode]);

  const showAmbient = !!(effective && condition);
  const wash = condition && effective ? SKY_WASH[condition.bucket][effective.isDay ? 'day' : 'night'] : '';
  const showCanvas = !!condition && ['rain', 'storm', 'snow', 'cloudy', 'fog'].includes(condition.bucket);

  return (
    <>
      {showAmbient && (
        <>
          {/* Ambient sky wash — subtle, behind all content */}
          <div
            aria-hidden
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
              background: wash,
            }}
          />

          {/* Weather particles */}
          {showCanvas && (
            <canvas
              ref={canvasRef}
              aria-hidden
              style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}
            />
          )}

          {/* Badge */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
              style={{
                position: 'fixed',
                bottom: '1rem',
                left: '1.5rem',
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '999px',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-2)',
                backdropFilter: 'blur(10px)',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.7rem',
                color: 'var(--fg-2)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{condition!.emoji}</span>
              <span>
                {effective!.temp}°C · {condition!.label}{effective!.city ? ` · ${effective!.city}` : ''}
              </span>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Dev-only: switch between conditions without waiting on real geolocation */}
      {devMode && (
        <div
          style={{
            position: 'fixed',
            top: '4.5rem',
            right: '1rem',
            zIndex: 45,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            maxWidth: '13rem',
            padding: '0.6rem',
            borderRadius: '10px',
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-2)',
            backdropFilter: 'blur(10px)',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
          }}
        >
          <span style={{ width: '100%', fontSize: '0.58rem', color: 'var(--fg-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
            weather preview (dev)
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: !override ? accent : 'var(--fg-3)', cursor: 'pointer' }}>
            <input type="radio" name="weather-preview" checked={!override} onChange={() => setOverride(null)} style={{ accentColor: accent }} />
            Live
          </label>
          {DEV_PRESETS.map((p) => (
            <label
              key={p.key}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: override?.key === p.key ? accent : 'var(--fg-3)', cursor: 'pointer' }}
            >
              <input
                type="radio"
                name="weather-preview"
                checked={override?.key === p.key}
                onChange={() => setOverride(p)}
                style={{ accentColor: accent }}
              />
              {p.label}
            </label>
          ))}
        </div>
      )}
    </>
  );
}
