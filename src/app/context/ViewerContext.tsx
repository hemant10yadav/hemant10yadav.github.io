'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ViewerType  = 'recruiter' | 'developer';
export type ColorMode   = 'dark' | 'light';

// ── theme colours — change here and it propagates everywhere ──────────────────
// Dark mode accents (on dark backgrounds)
export const RECRUITER_ACCENT       = '#f2c078';
export const DEVELOPER_ACCENT       = '#22d3ee';

// Light mode accents (darkened for readability on light backgrounds)
export const RECRUITER_ACCENT_LIGHT = '#b45309'; // amber-700
export const DEVELOPER_ACCENT_LIGHT = '#0891b2'; // cyan-600

export const getAccent = (type: ViewerType, mode: ColorMode = 'dark') =>
  type === 'recruiter'
    ? (mode === 'light' ? RECRUITER_ACCENT_LIGHT : RECRUITER_ACCENT)
    : (mode === 'light' ? DEVELOPER_ACCENT_LIGHT : DEVELOPER_ACCENT);

// ── context ───────────────────────────────────────────────────────────────────

interface ViewerContextValue {
  viewerType: ViewerType;
  accent: string;
  colorMode: ColorMode;
  ready: boolean;
  setViewerType: (type: ViewerType) => void;
  toggleViewerType: () => void;
  toggleColorMode: () => void;
}

const ViewerContext = createContext<ViewerContextValue>({
  viewerType: 'recruiter',
  accent: RECRUITER_ACCENT,
  colorMode: 'dark',
  ready: false,
  setViewerType: () => {},
  toggleViewerType: () => {},
  toggleColorMode: () => {},
});

function syncURL(type: ViewerType) {
  const url = new URL(window.location.href);
  url.searchParams.set('mode', type);
  window.history.replaceState({}, '', url.toString());
}

function applyColorMode(mode: ColorMode) {
  document.documentElement.setAttribute('data-theme', mode);
  try { localStorage.setItem('hy_color_mode', mode); } catch { /* ignore */ }
}

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewerType, setViewerTypeState] = useState<ViewerType>('recruiter');
  const [colorMode, setColorModeState]   = useState<ColorMode>('dark');
  const [ready, setReady]                = useState(false);

  // Read persisted state from URL + localStorage on mount
  useEffect(() => {
    // Viewer mode from URL
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'developer' || mode === 'recruiter') {
      setViewerTypeState(mode);
    }

    // Color mode from localStorage
    try {
      const saved = localStorage.getItem('hy_color_mode') as ColorMode | null;
      if (saved === 'light' || saved === 'dark') {
        setColorModeState(saved);
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch { /* ignore */ }

    setReady(true);
  }, []);

  const setViewerType = useCallback((type: ViewerType) => {
    setViewerTypeState(type);
    syncURL(type);
  }, []);

  const toggleViewerType = useCallback(() => {
    setViewerTypeState((prev) => {
      const next = prev === 'recruiter' ? 'developer' : 'recruiter';
      syncURL(next);
      return next;
    });
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyColorMode(next);
      return next;
    });
  }, []);

  const accent = getAccent(viewerType, colorMode);

  return (
    <ViewerContext.Provider value={{
      viewerType, accent, colorMode, ready,
      setViewerType, toggleViewerType, toggleColorMode,
    }}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewer = () => useContext(ViewerContext);
