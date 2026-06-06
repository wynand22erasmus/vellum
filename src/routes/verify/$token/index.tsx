import { createFileRoute } from '@tanstack/react-router';
import { VerifyPage } from '@/pages/verify-page';

export const Route = createFileRoute('/verify/$token/')({
  component: VerifyPage,
});
