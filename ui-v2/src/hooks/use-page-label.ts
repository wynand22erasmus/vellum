import { useLocation } from 'react-router-dom';
import { PAGE_LABELS, pageLabelForPath, type PageLabel } from '@/lib/page-labels';

export function usePageLabel(): PageLabel | null {
  const { pathname } = useLocation();
  return pageLabelForPath(pathname);
}

export function useAuthPanelLabel(pathname: string): PageLabel | null {
  if (pathname === '/login') return PAGE_LABELS.devLogin;
  if (pathname === '/login/email-verification') return PAGE_LABELS.verifyEmail;
  if (/^\/verify\/[^/]+\/complete$/.test(pathname)) return PAGE_LABELS.secureDownloadComplete;
  if (pathname.startsWith('/verify/')) return PAGE_LABELS.secureDocumentDownload;
  return null;
}
