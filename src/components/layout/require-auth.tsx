/**
 * Route guards and loading placeholders for authenticated views.
 *
 * @packageDocumentation
 */

import { Navigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthMe } from '@/hooks/use-auth-me';

/** Placeholder layout shown while session state is loading. */
export function AuthLoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

type RequireAuthProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
};

/** Redirect unauthenticated users to login; optionally require admin role. */
export function RequireAuth({
  children,
  requireAdmin = false,
  redirectTo = '/',
}: RequireAuthProps) {
  const { user, loading, isAdmin } = useAuthMe();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingSkeleton />;
  }

  if (!user) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

/** Require an authenticated admin before rendering child routes. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  return <RequireAuth requireAdmin>{children}</RequireAuth>;
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
