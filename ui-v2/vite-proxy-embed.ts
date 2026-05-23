import type { ProxyOptions } from 'vite';

/** Strip framing restrictions so dev services can load inside ui-v2 iframes. */
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
