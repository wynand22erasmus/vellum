/**
 * Vite proxy hooks for embedding Mailpit in the dev UI iframe.
 *
 * Proxied at `/dev-proxy/mailpit` in `vite.config.ts`. Injects Vellum theme CSS
 * and sets Bootstrap `data-bs-theme` from {@link readResolvedThemeCookie}.
 *
 * @packageDocumentation
 * @see README.md — local dev stack and port layout
 */

import type { ProxyOptions } from 'vite';
import { configureHtmlEmbedProxy } from './vite-html-embed-proxy.ts';

const THEME_LINK = '<link rel="stylesheet" href="/mailpit-vellum-theme.css">';

/** @internal */
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

/**
 * Wire Mailpit proxy hooks for iframe embed, theme CSS, and cookie sync.
 *
 * @param proxy - HTTP proxy instance from Vite `configure`.
 */
export function configureMailpitProxy(
  proxy: Parameters<NonNullable<ProxyOptions['configure']>>[0],
): void {
  configureHtmlEmbedProxy(proxy, { patchHtml: patchMailpitHtml });
}
