/**
 * Vite proxy hooks for embedding the MinIO console in the dev UI iframe.
 *
 * Proxied at `/dev-proxy/minio-console` in `vite.config.ts`. Rewrites the HTML
 * base href for the subpath, injects Vellum theme CSS, and syncs theme classes.
 *
 * @packageDocumentation
 * @see README.md — local dev stack and port layout
 */

import type { ProxyOptions } from 'vite';
import { configureHtmlEmbedProxy } from './vite-html-embed-proxy.ts';

const CONSOLE_PREFIX = '/dev-proxy/minio-console';
const THEME_LINK = '<link rel="stylesheet" href="/minio-console-vellum-theme.css">';

/** @internal */
function patchMinioConsoleHtml(html: string, theme: 'light' | 'dark'): string {
  let out = html;
  if (/<base\s/i.test(out)) {
    out = out.replace(/<base\s+href="[^"]*"\s*\/?>/i, `<base href="${CONSOLE_PREFIX}/" />`);
  } else {
    out = out.replace(/<head>/i, `<head><base href="${CONSOLE_PREFIX}/" />`);
  }

  if (!out.includes('minio-console-vellum-theme.css')) {
    out = out.replace('</head>', `  ${THEME_LINK}\n</head>`);
  }

  const themeClass = `vellum-theme vellum-theme-${theme}`;
  out = out.replace(/<html\b([^>]*)>/i, (_match, attrs: string) => {
    const raw = attrs ?? '';
    if (/class="/i.test(raw)) {
      return `<html${raw.replace(/class="([^"]*)"/i, (_m, classes: string) => {
        const cleaned = classes.replace(/\bvellum-theme(?:-\w+)?\b/g, '').replace(/\s+/g, ' ').trim();
        return `class="${cleaned} ${themeClass}"`;
      })}>`;
    }
    return `<html class="${themeClass}"${raw}>`;
  });

  return out;
}

/**
 * Wire MinIO console proxy hooks for iframe embed, subpath base URL, and theme CSS.
 *
 * @param proxy - HTTP proxy instance from Vite `configure`.
 */
export function configureMinioConsoleProxy(
  proxy: Parameters<NonNullable<ProxyOptions['configure']>>[0],
): void {
  configureHtmlEmbedProxy(proxy, { patchHtml: patchMinioConsoleHtml });
}
