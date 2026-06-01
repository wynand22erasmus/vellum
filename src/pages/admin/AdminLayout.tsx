/**
 * Admin section layout with shared page container and auth guard.
 *
 * @packageDocumentation
 */

import { Outlet } from 'react-router-dom';
import { PageContainer } from '@/components/layout/page-container';
import { RequireAdmin } from '@/components/layout/require-auth';

/** Wrap admin pages in auth checks and consistent page padding. */
export function AdminLayout() {
  return (
    <RequireAdmin>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </RequireAdmin>
  );
}
