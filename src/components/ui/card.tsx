/**
 * Card layout primitives for grouped content (shadcn-style).
 *
 * @packageDocumentation
 */

import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils.ts';

/** Bordered card container. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm ring-1 ring-[var(--color-accent)]/15',
        className,
      )}
      {...props}
    />
  );
}

/** Top section of a card (title area). */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6 pb-0', className)} {...props} />;
}

/** Card heading (`h3`). */
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />;
}

/** Muted subtitle text under the title. */
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-[var(--color-muted-foreground)]', className)} {...props} />
  );
}

/** Main card body below the header. */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}
