/**
 * Card layout primitives for grouped content (shadcn-style).
 *
 * @packageDocumentation
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils.ts';

/** Bordered card container. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm ring-1 ring-brand-accent/15',
        className,
      )}
      {...props}
    />
  );
}

/** Top section of a card (title area). */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 px-6 pb-0', className)}
      {...props}
    />
  );
}

/** Card heading (`h3`). */
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

/** Muted subtitle text under the title. */
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Main card body below the header. */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-content" className={cn('px-6', className)} {...props} />
  );
}
