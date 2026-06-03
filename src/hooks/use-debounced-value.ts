/**
 * Debounces a value for search inputs and server-backed table filters.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';

/**
 * Returns a copy of `value` that updates only after `delayMs` without changes.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
