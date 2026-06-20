/**
 * SHA-256 checksum display with copy action.
 *
 * @packageDocumentation
 */

import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { sha256sumVerifyHint } from '@/lib/verify-checksum';

type FileSha256DisplayProps = {
  sha256: string;
  fileName?: string;
  className?: string;
};

async function copyChecksum(sha256: string): Promise<void> {
  await navigator.clipboard.writeText(sha256);
  toast.success('Checksum copied');
}

/** Shows a file SHA-256 digest with copy and sha256sum helper text. */
export function FileSha256Display({ sha256, fileName, className }: FileSha256DisplayProps) {
  const verifyHint = sha256sumVerifyHint(fileName ?? 'downloaded-file');

  return (
    <div className={className} data-testid="file-sha256-display">
      <p className="mb-2 text-sm font-medium">SHA-256 checksum</p>
      <div className="flex items-start gap-2 rounded-md border bg-muted/40 p-3">
        <code className="flex-1 break-all text-left text-xs">{sha256}</code>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          aria-label="Copy SHA-256 checksum"
          onClick={() => void copyChecksum(sha256).catch(() => toast.error('Could not copy checksum'))}
        >
          <Copy className="size-4" aria-hidden />
          Copy
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Compare the output to the checksum above. {verifyHint}
      </p>
    </div>
  );
}
