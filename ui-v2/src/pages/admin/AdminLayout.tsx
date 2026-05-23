import { Outlet } from 'react-router-dom';
import { PageContainer } from '@/components/layout/page-container';
import { RequireAdmin } from '@/components/layout/require-auth';

export function AdminLayout() {
  return (
    <RequireAdmin>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </RequireAdmin>
  );
}
