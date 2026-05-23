import { Button } from '@/components/ui/button';

type TablePaginationProps = {
  offset: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function TablePagination({
  offset,
  pageSize,
  total,
  loading,
  onPrevious,
  onNext,
}: TablePaginationProps) {
  const canPrev = offset > 0;
  const canNext = offset + pageSize < total;

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">
        Showing {total === 0 ? 0 : offset + 1}–{Math.min(offset + pageSize, total)} of {total}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canPrev || loading}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canNext || loading}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
