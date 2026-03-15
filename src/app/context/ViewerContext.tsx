'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ViewerType = 'recruiter' | 'developer';

// ── theme colours — change here and it propagates everywhere ──────────────────
export const RECRUITER_ACCENT = '#d4a574';
export const DEVELOPER_ACCENT = '#22d3ee';

export const getAccent = (type: ViewerType) =>
  type === 'recruiter' ? RECRUITER_ACCENT : DEVELOPER_ACCENT;

// ── context ───────────────────────────────────────────────────────────────────

interface ViewerContextValue {
  viewerType: ViewerType;
  accent: string;
  ready: boolean;
  setViewerType: (type: ViewerType) => void;
  toggleViewerType: () => void;
}

const ViewerContext = createContext<ViewerContextValue>({
  viewerType: 'recruiter',
  accent: RECRUITER_ACCENT,
  ready: false,
  setViewerType: () => {},
  toggleViewerType: () => {},
});

function syncURL(type: ViewerType) {
  const url = new URL(window.location.href);
  url.searchParams.set('mode', type);
  window.history.replaceState({}, '', url.toString());
}

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewerType, setViewerTypeState] = useState<ViewerType>('recruiter');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'developer' || mode === 'recruiter') {
      setViewerTypeState(mode);
    }
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

  const accent = getAccent(viewerType);

  return (
    <ViewerContext.Provider value={{ viewerType, accent, ready, setViewerType, toggleViewerType }}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewer = () => useContext(ViewerContext);
