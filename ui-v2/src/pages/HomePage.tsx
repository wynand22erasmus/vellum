import { Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthMe } from '@/hooks/use-auth-me';

export function HomePage() {
  const { user, loading } = useAuthMe();

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
