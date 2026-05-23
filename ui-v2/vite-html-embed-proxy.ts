import type { ClientRequest, IncomingMessage, ServerResponse } from 'node:http';
import type { ProxyOptions } from 'vite';
import { allowDevIframeEmbed } from './vite-proxy-embed.ts';
import { readResolvedThemeCookie } from './vite-theme-cookie.ts';

function forwardHeaders(proxyRes: IncomingMessage, res: ServerResponse): void {
  res.statusCode = proxyRes.statusCode ?? 200;
  for (const [key, value] of Object.entries(proxyRes.headers)) {
    if (value === undefined || key === 'content-length' || key === 'transfer-encoding') {
      continue;
    }
    res.setHeader(key, value);
  }
}

function pipeProxyResponse(proxyRes: IncomingMessage, res: ServerResponse): void {
  forwardHeaders(proxyRes, res);
  proxyRes.pipe(res);
}

type HtmlEmbedProxyOptions = {
  patchHtml: (html: string, theme: 'light' | 'dark') => string;
};

export function configureHtmlEmbedProxy(
  proxy: Parameters<NonNullable<ProxyOptions['configure']>>[0],
  options: HtmlEmbedProxyOptions,
): void {
  allowDevIframeEmbed()(proxy);

  proxy.on('proxyReq', (proxyReq: ClientRequest) => {
    proxyReq.removeHeader('accept-encoding');
  });

  proxy.on('proxyRes', (proxyRes: IncomingMessage, req: IncomingMessage, res: ServerResponse) => {
    const contentType = proxyRes.headers['content-type'] ?? '';
    if (!contentType.includes('text/html')) {
      pipeProxyResponse(proxyRes, res);
      return;
    }

    const chunks: Buffer[] = [];
    proxyRes.on('data', (chunk: Buffer) => chunks.push(chunk));
    proxyRes.on('end', () => {
      const theme = readResolvedThemeCookie(req.headers.cookie);
      const body = options.patchHtml(Buffer.concat(chunks).toString('utf8'), theme);
      const buf = Buffer.from(body, 'utf8');
      forwardHeaders(proxyRes, res);
      res.setHeader('content-length', String(buf.length));
      res.removeHeader('content-encoding');
      res.end(buf);
    });
    proxyRes.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(502);
      }
      res.end();
    });
  });
}
