/**
 * Applies build-time brand preset to the document and React context.
 *
 * @packageDocumentation
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { getBrandPreset, type BrandPreset } from '@/lib/brand/presets';

const BrandContext = createContext<BrandPreset | null>(null);

function resolvePresetId(): string {
  const fromEnv = import.meta.env.VITE_BRAND_PRESET as string | undefined;
  return fromEnv?.trim() || 'vellum';
}

/** Provides brand preset to app components. */
export function BrandProvider({ children }: { children: ReactNode }) {
  const preset = useMemo(() => getBrandPreset(resolvePresetId()), []);

  useEffect(() => {
    document.documentElement.dataset.brand = preset.id;
    document.title = preset.documentTitle;

    const favicon =
      document.querySelector<HTMLLinkElement>('link[rel="icon"][sizes="512x512"]') ??
      document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = preset.logos.favicon;

    const apple =
      document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (apple && preset.logos.appleTouchIcon) apple.href = preset.logos.appleTouchIcon;
  }, [preset]);

  return (
    <BrandContext.Provider value={preset}>{children}</BrandContext.Provider>
  );
}

/** Active brand preset for chrome and copy. */
export function useBrand(): BrandPreset {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx;
}
