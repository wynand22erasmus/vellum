/**
 * Home redirect (handled by route beforeLoad).
 *
 * @packageDocumentation
 */

import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder while home route redirects unauthenticated users. */
export function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Skeleton className="h-6 w-32" />
    </div>
  );
}
