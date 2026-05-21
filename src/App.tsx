/**
 * SPA root: client-side routes for home, verify, login, and dashboard.
 *
 * @packageDocumentation
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/app-shell.tsx';
import { SidebarLayout } from './layouts/sidebar-layout.tsx';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage.tsx';
import { AdminDocumentDetailPage } from './pages/admin/AdminDocumentDetailPage.tsx';
import { AdminDocumentsPage } from './pages/admin/AdminDocumentsPage.tsx';
import { AdminFailedAuditLogsPage } from './pages/admin/AdminFailedAuditLogsPage.tsx';
import { AdminIndexPage } from './pages/admin/AdminIndexPage.tsx';
import { AdminLayout } from './pages/admin/AdminLayout.tsx';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { DevLoginPage } from './pages/DevLoginPage.tsx';
import { EmailVerificationPage } from './pages/EmailVerificationPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { VerifyPage } from './pages/VerifyPage.tsx';

/** Application router and route table. */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/verify/:token" element={<VerifyPage />} />
            <Route path="/login" element={<DevLoginPage />} />
            <Route path="/login/email-verification" element={<EmailVerificationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
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
    </BrowserRouter>
  );
}
