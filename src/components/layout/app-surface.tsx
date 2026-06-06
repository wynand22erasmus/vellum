/**
 * Shared surface/backdrop styling aligned with the login page.
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Layered content backdrop (see surface-gradients.css). */
export function AppSurfaceBackdrop() {
  return (
    <div className="surface-backdrop pointer-events-none absolute inset-0" aria-hidden />
  );
}

/** Gold accent line matching elevated login cards. */
export function SurfaceAccentLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute inset-x-6 -top-px h-px bg-linear-to-r from-transparent via-brand-accent/80 to-transparent',
        className,
      )}
      aria-hidden
    />
  );
}

type AppSurfaceProps = {
  children: ReactNode;
  className?: string;
};

/** Relative wrapper with the standard app gradient backdrop. */
export function AppSurface({ children, className }: AppSurfaceProps) {
  return (
    <div className={cn('relative flex min-h-0 min-w-0 flex-1 flex-col', className)}>
      <AppSurfaceBackdrop />
      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/** Shared elevated panel classes (cards, tables, panels). */
export const elevatedSurfaceClassName =
  'relative overflow-hidden border-border/60 bg-card/95 shadow-md shadow-primary/8 ring-1 ring-primary/10 backdrop-blur-sm';

/** Muted band for table headers and filter summaries. */
export const surfaceBandClassName = 'surface-band';
