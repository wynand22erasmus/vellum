/**
 * Brand logo for shell and public pages.
 *
 * @packageDocumentation
 */

import { useBrand } from '@/providers/brand-provider';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  variant?: 'mark' | 'full';
  className?: string;
};

/** Renders the active brand logo image. */
export function BrandLogo({ variant = 'mark', className }: BrandLogoProps) {
  const brand = useBrand();
  const src = variant === 'full' ? brand.logos.full : brand.logos.mark;
  const alt = brand.displayName;

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        variant === 'full' ? 'h-auto w-full max-w-[16rem]' : 'size-8',
        className,
      )}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.endsWith('/favicon.png')) return;
        img.src = '/favicon.png';
      }}
    />
  );
}

/** Wordmark + tagline for public hero sections. */
export function BrandTitle({ className }: { className?: string }) {
  const brand = useBrand();
  return (
    <div className={cn('text-center', className)}>
      {brand.wordmark ? (
        <p className="text-2xl font-semibold tracking-[0.15em] text-foreground">{brand.wordmark}</p>
      ) : (
        <p className="text-2xl font-semibold text-foreground">{brand.displayName}</p>
      )}
      <p className="mt-1 text-sm text-muted-foreground">{brand.tagline}</p>
    </div>
  );
}
