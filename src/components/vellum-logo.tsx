import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils.ts';

type VellumLogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
  linked?: boolean;
  href?: string;
};

function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn('hidden flex-col items-center text-center dark:flex', className)}>
      <span className="text-2xl font-bold tracking-[0.2em] text-[var(--color-foreground)]">
        VELLUM
      </span>
      <span className="mt-1 text-[0.65rem] font-medium tracking-[0.18em] text-[var(--color-accent)]">
        DOCUMENT | API | HOSTING
      </span>
    </div>
  );
}

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
    <div className={cn('flex flex-col items-center', className)}>
      <img
        src={src}
        alt={alt}
        width={320}
        height={320}
        className="mx-auto h-auto w-full max-w-[280px] dark:hidden"
      />
      <img
        src="/favicon.png"
        alt=""
        aria-hidden
        width={72}
        height={72}
        className="mb-3 hidden h-[72px] w-[72px] object-contain dark:block"
      />
      <LogoWordmark />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={cn('h-10 w-10 shrink-0 object-contain', className)}
    />
  );

  if (!linked) {
    return image;
  }

  return (
    <Link
      to={href}
      className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
    >
      {image}
    </Link>
  );
}
