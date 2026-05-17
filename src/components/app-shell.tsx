import type { ReactNode } from 'react';
import { ThemeToggle } from './theme-toggle.tsx';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end p-4">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
      {children}
    </div>
  );
}
