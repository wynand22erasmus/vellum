/**
 * Centered page wrapper with optional title and actions.
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/page-header';

type PageContainerProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'narrow' | 'wide';
  className?: string;
};

/** Page shell with optional header. */
export function PageContainer({
  children,
  title,
  description,
  actions,
  variant = 'default',
  className,
}: PageContainerProps) {
  const maxW =
    variant === 'narrow' ? 'max-w-3xl' : variant === 'wide' ? 'max-w-7xl' : 'max-w-5xl';

  return (
    <div className={cn('mx-auto w-full flex-1 p-6 md:p-8', maxW, className)}>
      {title ? <PageHeader title={title} description={description} actions={actions} className="mb-8" /> : null}
      {children}
    </div>
  );
}
