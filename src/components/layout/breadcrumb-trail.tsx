/**
 * Breadcrumb trail for using TanStack Router links.
 *
 * @packageDocumentation
 */

import { Fragment } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import type { TrailSegment } from '@/lib/nav-trail';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/** Render linked breadcrumb segments for the app. */
export function BreadcrumbTrail({ segments }: { segments: TrailSegment[] }) {
  if (segments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="min-w-0 flex-1">
      <BreadcrumbList className="flex-nowrap">
        {segments.map((segment, index) => (
          <Fragment key={`${segment.label}-${index}`}>
            {index > 0 ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem className="truncate">
              {segment.href ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={segment.href}
                    aria-current={index === segments.length - 1 ? 'page' : undefined}
                    className={cn(
                      index === segments.length - 1 && 'font-normal text-foreground',
                    )}
                  >
                    {segment.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
