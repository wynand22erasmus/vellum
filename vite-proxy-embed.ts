/**
 * Vite proxy helper that relaxes framing restrictions for dev iframe embeds.
 *
 * Removes `X-Frame-Options` and `frame-ancestors` CSP directives from proxied
 * responses so Mailpit, MinIO, and Adminer can load inside the dev UI.
 *
 * @packageDocumentation
 */

import type { ProxyOptions } from 'vite';

/**
 * Return a Vite `configure` hook that strips framing restrictions from proxied responses.
 *
 * @returns Vite `ProxyOptions.configure` callback for dev-proxy routes.
 */
export function allowDevIframeEmbed(): NonNullable<ProxyOptions['configure']> {
  return (proxy) => {
    proxy.on('proxyRes', (proxyRes) => {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['X-Frame-Options'];

      const csp = proxyRes.headers['content-security-policy'];
      if (typeof csp === 'string') {
        const next = csp
          .replace(/frame-ancestors[^;]*;?/gi, '')
          .replace(/;\s*;/g, ';')
          .trim();
        if (next) {
          proxyRes.headers['content-security-policy'] = next;
        } else {
          delete proxyRes.headers['content-security-policy'];
        }
      }
    });
  };
}
