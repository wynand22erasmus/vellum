import { createFileRoute } from '@tanstack/react-router';
import { EmailVerificationPage } from '@/pages/email-verification-page';

export const Route = createFileRoute('/login/email-verification')({
  component: EmailVerificationPage,
});
