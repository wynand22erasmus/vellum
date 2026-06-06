/**
 * Loading placeholders for authenticated views.
 *
 * @packageDocumentation
 */

import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder layout shown while session state is loading. */
export function AuthLoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

/** Sidebar footer placeholder while the current user is loading. */
export function SidebarUserSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Skeleton className="size-8 rounded-lg" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  );
}
