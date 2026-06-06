import { createFileRoute, redirect } from '@tanstack/react-router';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { HomePage } from '@/pages/home-page';

export const Route = createFileRoute('/')({
  component: HomePage,
  beforeLoad: ({ context }) => {
    const auth = (context as { auth: { loading: boolean; user: unknown } }).auth;
    if (auth.loading) return;
    if (auth.user) {
      throw redirect({ to: normalizeAppPath('/dashboard') });
    }
    throw redirect({ to: normalizeAppPath('/login') });
  },
});
