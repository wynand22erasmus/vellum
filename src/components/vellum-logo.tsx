/**
 * Branded Vellum logo and wordmark for headers and auth panels.
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** Props for {@link VellumLogo}. */
export type VellumLogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
  linked?: boolean;
  href?: string;
};

const logoFrameClass =
  'rounded-xl border border-border bg-logo-surface shadow-sm';

function LogoFrame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(logoFrameClass, className)}>{children}</div>;
}

function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn('hidden flex-col items-center text-center dark:flex', className)}>
      <span className="text-3xl font-bold tracking-[0.2em] text-foreground">VELLUM</span>
      <span className="mt-1.5 text-xs font-medium tracking-[0.18em] text-brand-accent">
        DOCUMENT | API | HOSTING
      </span>
    </div>
  );
}

/** Render the full or mark logo, optionally wrapped in a home link. */
export function VellumLogo({
  variant = 'full',
  className,
  linked = true,
  href = '/',
}: VellumLogoProps) {
  const isFull = variant === 'full';
  const src = isFull ? '/logo.png' : '/favicon.png';
  const alt = isFull ? 'Vellum — Document | API | Hosting' : 'Vellum';

  const image: ReactNode = isFull ? (
    <LogoFrame className={cn('flex flex-col items-center px-5 py-4', className)}>
      <img src={src} alt={alt} width={200} height={80} className="max-h-20 w-auto dark:hidden" />
      <LogoWordmark />
    </LogoFrame>
  ) : (
    <img src={src} alt={alt} width={32} height={32} className={cn('object-contain', className)} />
  );

  if (!linked) return image;
  return (
    <Link to={href} className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {image}
    </Link>
  );
}
