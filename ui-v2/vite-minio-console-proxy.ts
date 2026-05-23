import type { ProxyOptions } from 'vite';
import { configureHtmlEmbedProxy } from './vite-html-embed-proxy.ts';

const CONSOLE_PREFIX = '/dev-proxy/minio-console';
const THEME_LINK = '<link rel="stylesheet" href="/minio-console-vellum-theme.css">';

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

/** MinIO console iframe proxy: framing headers, subpath base URL, and Vellum theme CSS. */
export function configureMinioConsoleProxy(
  proxy: Parameters<NonNullable<ProxyOptions['configure']>>[0],
): void {
  configureHtmlEmbedProxy(proxy, { patchHtml: patchMinioConsoleHtml });
}
