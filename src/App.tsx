/**
 * Top-level React Router configuration for the Vellum SPA.
 *
 * @packageDocumentation
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/components/providers/auth-provider';
import { AppShell } from '@/components/layout/app-shell';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { DevEmbedPage } from '@/pages/DevEmbedPage';
import { DevIndexPage } from '@/pages/dev/DevIndexPage';
import { DevLayout } from '@/pages/dev/DevLayout';
import { DevLoginPage } from '@/pages/DevLoginPage';
import { EmailVerificationPage } from '@/pages/EmailVerificationPage';
import { HomePage } from '@/pages/HomePage';
import { VerifyCompletePage } from '@/pages/VerifyCompletePage';
import { VerifyPage } from '@/pages/VerifyPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminDocumentDetailPage } from '@/pages/admin/AdminDocumentDetailPage';
import { AdminDocumentsPage } from '@/pages/admin/AdminDocumentsPage';
import { AdminFailedAuditLogsPage } from '@/pages/admin/AdminFailedAuditLogsPage';
import { AdminIndexPage } from '@/pages/admin/AdminIndexPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';

/** Mount the authenticated app shell and all public and admin routes. */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/verify/:token/complete" element={<VerifyCompletePage />} />
            <Route path="/verify/:token" element={<VerifyPage />} />
            <Route path="/login" element={<DevLoginPage />} />
            <Route path="/login/email-verification" element={<EmailVerificationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dev" element={<DevLayout />}>
              <Route index element={<DevIndexPage />} />
              <Route path=":serviceId" element={<DevEmbedPage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminIndexPage />} />
              <Route path="documents" element={<AdminDocumentsPage />} />
              <Route path="documents/:id" element={<AdminDocumentDetailPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="failed-audit-logs" element={<AdminFailedAuditLogsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
