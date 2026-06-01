/**
 * Standard page padding and width constraints for routed views.
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageContainerProps = {
  variant?: 'narrow' | 'full';
  className?: string;
  children: ReactNode;
};

function PageContainerRoot({ variant = 'full', className, children }: PageContainerProps) {
  return (
    <div
      className={cn('flex-1 space-y-6 p-4', variant === 'narrow' && 'mx-auto max-w-5xl', className)}
    >
      {children}
    </div>
  );
}

type TableFrameProps = {
  children: ReactNode;
  className?: string;
};

function TableFrame({ children, className }: TableFrameProps) {
  return <div className={cn('rounded-md border', className)}>{children}</div>;
}

/** Page wrapper with an optional bordered table frame subcomponent. */
export const PageContainer = Object.assign(PageContainerRoot, { TableFrame });
