import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  persistPageChromeMode,
  readPageChromeMode,
  type PageChromeMode,
} from '@/lib/page-chrome-mode';

type RouteChromeContextValue = {
  mode: PageChromeMode;
  trailTailLabel: string | null;
  setTrailTailLabel: (label: string | null) => void;
};

const RouteChromeContext = createContext<RouteChromeContextValue | null>(null);

export function RouteChromeProvider({ children }: { children: ReactNode }) {
  const { search } = useLocation();
  const mode = useMemo(() => {
    const next = readPageChromeMode(search);
    persistPageChromeMode(next);
    return next;
  }, [search]);

  const [trailTailLabel, setTrailTailLabelState] = useState<string | null>(null);

  const setTrailTailLabel = useCallback((label: string | null) => {
    setTrailTailLabelState(label);
  }, []);

  const value = useMemo(
    () => ({ mode, trailTailLabel, setTrailTailLabel }),
    [mode, trailTailLabel, setTrailTailLabel],
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
