import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePageLabel } from '@/hooks/use-page-label';
import { pageChromeQuery } from '@/lib/page-chrome-mode';
import { useRouteChrome } from '@/components/layout/route-chrome-provider';

type PageTitleBlockProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function PageTitleBlock({ title, description, actions }: PageTitleBlockProps) {
  const { mode } = useRouteChrome();
  const pageLabel = usePageLabel();
  const { pathname } = useLocation();

  if (mode !== 'page-title') {
    return null;
  }

  const resolvedTitle = title ?? pageLabel?.nav;
  const resolvedDescription = description ?? pageLabel?.description;

  if (!resolvedTitle && !resolvedDescription && !actions) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-dashed border-primary/30 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        Preview: page titles in the body.{' '}
        <Link
          to={{ pathname, search: pageChromeQuery('header') }}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Back to header subtitles
        </Link>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {resolvedTitle ? (
            <h1 className="text-2xl font-semibold tracking-tight">{resolvedTitle}</h1>
          ) : null}
          {resolvedDescription ? (
            <p className="mt-1 text-sm text-muted-foreground">{resolvedDescription}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
