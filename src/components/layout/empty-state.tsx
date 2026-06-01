/**
 * Centered empty-state message for lists and tables with no rows.
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

/** Display a title, description, and optional action when content is absent. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      {title ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {action}
    </div>
  );
}
