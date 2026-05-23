import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api.ts';

type UseApiQueryOptions<T> = {
  path: string;
  enabled?: boolean;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  parse: (res: Response) => Promise<T>;
};

export function useApiQuery<T>({
  path,
  enabled = true,
  onUnauthorized,
  onForbidden,
  parse,
}: UseApiQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch(path);
        if (cancelled) return;
        if (res.status === 401) {
          onUnauthorized?.();
          return;
        }
        if (res.status === 403) {
          onForbidden?.();
          setError('Access denied.');
          return;
        }
        if (!res.ok) {
          setError('Request failed.');
          return;
        }
        setData(await parse(res));
      } catch {
        if (!cancelled) setError('Network error.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path, enabled, onUnauthorized, onForbidden, parse, tick]);

  return { data, loading, error, refetch };
}
