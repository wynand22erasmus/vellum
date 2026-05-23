export type PageChromeMode = 'header' | 'page-title';

const STORAGE_KEY = 'vellum-page-chrome';

export function readPageChromeMode(search: string): PageChromeMode {
  const params = new URLSearchParams(search);
  const fromQuery = params.get('chrome');
  if (fromQuery === 'page-title' || fromQuery === 'header') {
    return fromQuery;
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'page-title' || stored === 'header') {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'header';
}

export function persistPageChromeMode(mode: PageChromeMode): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

export function pageChromeQuery(mode: PageChromeMode): string {
  return mode === 'page-title' ? '?chrome=page-title' : '?chrome=header';
}
