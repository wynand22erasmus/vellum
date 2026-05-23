import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type RouteChromeContextValue = {
  trailTailLabel: string | null;
  setTrailTailLabel: (label: string | null) => void;
};

const RouteChromeContext = createContext<RouteChromeContextValue | null>(null);

export function RouteChromeProvider({ children }: { children: ReactNode }) {
  const [trailTailLabel, setTrailTailLabelState] = useState<string | null>(null);

  const setTrailTailLabel = useCallback((label: string | null) => {
    setTrailTailLabelState(label);
  }, []);

  const value = useMemo(
    () => ({ trailTailLabel, setTrailTailLabel }),
    [trailTailLabel, setTrailTailLabel],
  );

  return <RouteChromeContext.Provider value={value}>{children}</RouteChromeContext.Provider>;
}

export function useRouteChrome(): RouteChromeContextValue {
  const ctx = useContext(RouteChromeContext);
  if (!ctx) {
    throw new Error('useRouteChrome must be used within RouteChromeProvider');
  }
  return ctx;
}
