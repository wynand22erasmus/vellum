import type { ProxyOptions } from 'vite';
import { configureHtmlEmbedProxy } from './vite-html-embed-proxy.ts';

const THEME_LINK =
  '<link rel="stylesheet" type="text/css" href="/adminer-vellum-theme.css">';

function patchAdminerHtml(html: string, theme: 'light' | 'dark'): string {
  let out = html;

  if (!out.includes('adminer-vellum-theme.css')) {
    out = out.replace(/<link rel="stylesheet"[^>]*>/i, (match) => `${match}\n${THEME_LINK}`);
  }

  const themeClasses = `vellum-theme vellum-theme-${theme}`;
  out = out.replace(/<body([^>]*)>/i, (_match, attrs: string) => {
    const raw = attrs ?? '';
    if (/class="/i.test(raw)) {
      return `<body${raw.replace(/class="([^"]*)"/i, (_m, classes: string) => {
        const cleaned = classes.replace(/\bvellum-theme(?:-\w+)?\b/g, '').replace(/\s+/g, ' ').trim();
        return `class="${cleaned} ${themeClasses}"`;
      })}>`;
    }
    return `<body class="${themeClasses}"${raw}>`;
  });

  return out;
}

/** Adminer iframe proxy: framing headers, Vellum theme CSS, and theme cookie sync. */
export function configureAdminerProxy(
  proxy: Parameters<NonNullable<ProxyOptions['configure']>>[0],
): void {
  configureHtmlEmbedProxy(proxy, { patchHtml: patchAdminerHtml });
}
