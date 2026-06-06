import { createFileRoute } from '@tanstack/react-router';
import { VerifyCompletePage } from '@/pages/verify-complete-page';

export const Route = createFileRoute('/verify/$token/complete')({
  component: VerifyCompletePage,
});
