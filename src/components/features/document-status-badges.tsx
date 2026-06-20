/**
 * Status badges for document link, file, download, and deletion state.
 *
 * @packageDocumentation
 */

import { Badge } from '@/components/ui/badge';

/** Props for {@link DocumentStatusBadges}. */
export type DocumentStatusBadgesProps = {
  linkActive: boolean;
  fileAvailable: boolean;
  isUsed?: boolean;
  maxDownloads?: number;
  downloadCount?: number;
  downloadsRemaining?: number;
  revokedAt?: string | null;
  deletedAt?: string | null;
  formatDeletedAt?: (iso: string) => string;
};

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <Badge
      variant={active ? 'default' : 'secondary'}
      className={
        active
          ? 'bg-badge-active text-badge-active-foreground'
          : 'bg-badge-inactive text-badge-inactive-foreground'
      }
    >
      {label}
    </Badge>
  );
}

/** Render link, file, download, and deletion badges for a document row. */
export function DocumentStatusBadges({
  linkActive,
  fileAvailable,
  isUsed,
  maxDownloads,
  downloadCount,
  downloadsRemaining,
  revokedAt,
  deletedAt,
  formatDeletedAt,
}: DocumentStatusBadgesProps) {
  const downloadLabel =
    maxDownloads !== undefined && downloadCount !== undefined
      ? downloadsRemaining !== undefined
        ? `${downloadCount}/${maxDownloads} downloads`
        : `${downloadCount}/${maxDownloads} downloads`
      : null;

  return (
    <div className="flex flex-wrap gap-1">
      {revokedAt ? <Badge variant="destructive">Revoked</Badge> : null}
      <StatusBadge label={linkActive ? 'Link active' : 'Link expired'} active={linkActive} />
      <StatusBadge
        label={fileAvailable ? 'File available' : 'File scrubbed'}
        active={fileAvailable}
      />
      {downloadLabel ? <Badge variant="outline">{downloadLabel}</Badge> : null}
      {isUsed && !downloadLabel ? <Badge variant="outline">Downloaded</Badge> : null}
      {deletedAt ? (
        <Badge variant="outline">
          Deleted{formatDeletedAt ? ` ${formatDeletedAt(deletedAt)}` : ''}
        </Badge>
      ) : null}
    </div>
  );
}
