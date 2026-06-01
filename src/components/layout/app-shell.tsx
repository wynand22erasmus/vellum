/**
 * Minimal root layout outlet for global providers and nested routes.
 *
 * @packageDocumentation
 */

import { Outlet } from 'react-router-dom';

/** Pass through nested routes without additional chrome. */
export function AppShell() {
  return <Outlet />;
}
