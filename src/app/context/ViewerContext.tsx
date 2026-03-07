'use client';

import { createContext, useContext, useState } from 'react';

export type ViewerType = 'recruiter' | 'developer' | null;

interface ViewerContextValue {
  viewerType: ViewerType;
  setViewerType: (type: ViewerType) => void;
}

const ViewerContext = createContext<ViewerContextValue>({
  viewerType: null,
  setViewerType: () => {},
});

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewerType, setViewerType] = useState<ViewerType>(null);

  return (
    <ViewerContext.Provider value={{ viewerType, setViewerType }}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewer = () => useContext(ViewerContext);
