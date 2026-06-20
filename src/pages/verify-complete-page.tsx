/**
 * Verify complete page (content only — shell from `AuthLayout`).
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { FileSha256Display } from '@/components/features/file-sha256-display';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import { readVerifyChecksum, type VerifyChecksumPayload } from '@/lib/verify-checksum';
import { AuthCard } from '@/components/layout/auth-layout';

/** Confirmation shown after a successful verify download. */
export function VerifyCompletePage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const [checksum, setChecksum] = useState<VerifyChecksumPayload | null>(null);

  useEffect(() => {
    if (!token) return;
    setChecksum(readVerifyChecksum(token));
  }, [token]);

  return (
    <AuthCard
      title={PAGE_LABELS.secureDownloadComplete.nav}
      description={panelDescription(PAGE_LABELS.secureDownloadComplete)}
      showLogo={false}
      className="max-w-md text-center"
      elevated
    >
      <div className="flex flex-col items-center gap-4" data-testid="verify-complete">
        <CheckCircle2 className="size-12 text-success" aria-hidden />
        <p className="text-sm text-muted-foreground">
          If your download did not start, return to the previous page and try again within a few minutes.
          You can close this tab once the file has saved.
        </p>
        {checksum ? (
          <FileSha256Display
            sha256={checksum.sha256}
            fileName={checksum.fileName}
            className="w-full text-left"
          />
        ) : null}
      </div>
    </AuthCard>
  );
}
