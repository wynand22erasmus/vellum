/**
 * Collapse the sidebar during secure document verification flows.
 *
 * @packageDocumentation
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { isVerifyFlowPath } from '@/lib/verify-routes';

/** Keeps the sidebar collapsed on secure download and download-complete screens. */
export function CollapseSidebarForVerify() {
  const { pathname } = useLocation();
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (isVerifyFlowPath(pathname)) {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  return null;
}
