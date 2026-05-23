import type { ProxyOptions } from 'vite';
import { configureHtmlEmbedProxy } from './vite-html-embed-proxy.ts';

const THEME_LINK = '<link rel="stylesheet" href="/mailpit-vellum-theme.css">';

function patchMailpitHtml(html: string, theme: 'light' | 'dark'): string {
  let out = html.replace(/<html\b([^>]*)>/i, (_match, attrs: string) => {
    let next = attrs ?? '';
    if (/data-bs-theme=/i.test(next)) {
      next = next.replace(/data-bs-theme="[^"]*"/i, `data-bs-theme="${theme}"`);
    } else {
      next = `${next} data-bs-theme="${theme}"`;
    }
    return `<html${next}>`;
  });

  if (!out.includes('mailpit-vellum-theme.css')) {
    out = out.replace('</head>', `  ${THEME_LINK}\n</head>`);
  }

  return out;
}

/** Mailpit iframe proxy: framing headers, Vellum theme CSS, and theme cookie sync. */
export function configureMailpitProxy(
  proxy: Parameters<NonNullable<ProxyOptions['configure']>>[0],
): void {
  configureHtmlEmbedProxy(proxy, { patchHtml: patchMailpitHtml });
}
