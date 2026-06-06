/**
 * Verify complete page (content only — shell from `AuthLayout`).
 *
 * @packageDocumentation
 */

import { CheckCircle2 } from 'lucide-react';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import { AuthCard } from '@/components/layout/auth-layout';

/** Confirmation shown after a successful verify download. */
export function VerifyCompletePage() {
  return (
    <AuthCard
      title={PAGE_LABELS.secureDownloadComplete.nav}
      description={panelDescription(PAGE_LABELS.secureDownloadComplete)}
      showLogo={false}
      className="max-w-md text-center"
      elevated
    >
      <div className="flex flex-col items-center gap-3" data-testid="verify-complete">
        <CheckCircle2 className="size-12 text-success" aria-hidden />
        <p className="text-sm text-muted-foreground">You can close this browser tab.</p>
      </div>
    </AuthCard>
  );
}
