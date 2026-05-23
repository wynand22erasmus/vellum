import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { TrailSegment } from '@/lib/nav-trail';

export function NavTrail({ segments }: { segments: TrailSegment[] }) {
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
              ) : index === segments.length - 1 ? (
                <BreadcrumbPage className="truncate">{segment.label}</BreadcrumbPage>
              ) : (
                <span className="truncate text-muted-foreground">{segment.label}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
