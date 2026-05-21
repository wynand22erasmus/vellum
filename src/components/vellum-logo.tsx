/**
 * Vellum brand logo (full wordmark or favicon mark).
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils.ts';

/** Props for {@link VellumLogo}. */
export type VellumLogoProps = {
  /** `full` shows wordmark image; `mark` shows favicon only. */
  variant?: 'full' | 'mark';
  className?: string;
  /** When false, renders image only without a home link. */
  linked?: boolean;
  /** Router target when `linked` is true. */
  href?: string;
};

const logoFrameClass =
  'rounded-xl border border-border bg-logo-surface shadow-sm';

/** @internal */
function LogoFrame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(logoFrameClass, className)}>{children}</div>;
}

/** @internal */
function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn('hidden flex-col items-center text-center dark:flex', className)}>
      <span className="text-3xl font-bold tracking-[0.2em] text-foreground">
        VELLUM
      </span>
      <span className="mt-1.5 text-xs font-medium tracking-[0.18em] text-brand-accent">
        DOCUMENT | API | HOSTING
      </span>
    </div>
  );
}

/**
 * Brand logo with optional link to home.
 *
 * @param props - {@link VellumLogoProps}
 */
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
      <img
        src={src}
        alt={alt}
        width={400}
        height={400}
        className="mx-auto h-auto w-full max-w-[340px] dark:hidden"
      />
      <img
        src="/favicon.png"
        alt=""
        aria-hidden
        width={88}
        height={88}
        className="mb-3 hidden h-[88px] w-[88px] object-contain dark:block"
      />
      <LogoWordmark />
    </LogoFrame>
  ) : (
    <LogoFrame className={cn('inline-flex p-1.5', className)}>
      <img
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="h-12 w-12 shrink-0 object-contain"
      />
    </LogoFrame>
  );

  if (!linked) {
    return image;
  }

  return (
    <Link
      to={href}
      className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {image}
    </Link>
  );
}
