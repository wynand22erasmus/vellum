/**
 * Root layout wrapper for the SPA router outlet.
 *
 * @packageDocumentation
 */

import { Outlet } from 'react-router-dom';

/** Top-level app shell (sidebar layout is nested inside). */
export function AppShell() {
  return <Outlet />;
}
