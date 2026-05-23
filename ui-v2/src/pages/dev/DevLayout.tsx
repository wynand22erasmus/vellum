import { Outlet, useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/layout/page-container';
import { RequireAdmin } from '@/components/layout/require-auth';

export function DevLayout() {
  const { pathname } = useLocation();
  const isOverview = pathname === '/dev';

  return (
    <RequireAdmin>
      {isOverview ? (
        <PageContainer>
          <Outlet />
        </PageContainer>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      )}
    </RequireAdmin>
  );
}
