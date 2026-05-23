import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TableLoadingSkeletonProps = {
  rows?: number;
  className?: string;
};

export function TableLoadingSkeleton({ rows = 3, className }: TableLoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
