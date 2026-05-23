import { CheckCircle2 } from 'lucide-react';
import { VellumLogo } from '@/components/vellum-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';

export function VerifyCompletePage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <VellumLogo variant="full" linked={false} />
          <CheckCircle2 className="mt-4 size-12 text-primary" aria-hidden />
          <CardTitle className="pt-2">{PAGE_LABELS.secureDownloadComplete.nav}</CardTitle>
          <CardDescription>{panelDescription(PAGE_LABELS.secureDownloadComplete)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            You can close this browser tab.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
