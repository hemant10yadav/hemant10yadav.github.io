'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ViewerType = 'recruiter' | 'developer';

interface ViewerContextValue {
  viewerType: ViewerType;
  ready: boolean;
  setViewerType: (type: ViewerType) => void;
  toggleViewerType: () => void;
}

const ViewerContext = createContext<ViewerContextValue>({
  viewerType: 'recruiter',
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

  // Read mode from URL on mount (client only)
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

  return (
    <ViewerContext.Provider value={{ viewerType, ready, setViewerType, toggleViewerType }}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewer = () => useContext(ViewerContext);
