/**
 * Dev-only service links for local navigation (Mailpit, MinIO, API docs).
 *
 * @packageDocumentation
 */

import { buildMinioPublicEndpoint, buildPublicUrl } from './public-url.ts';

/** A single entry in the dev services menu. */
export type DevServiceLink = {
  id: string;
  label: string;
  url: string;
  description?: string;
};

function devHost(): string {
  return process.env.VELLUM_HOST?.trim() || 'localhost';
}

function minioHost(minioPublicEndpoint: string): string {
  try {
    return new URL(minioPublicEndpoint).hostname;
  } catch {
    return devHost();
  }
}

function httpUrl(host: string, port: string, path = ''): string {
  return `http://${host}:${port}${path}`;
}

/**
 * Browser-reachable URLs for local infrastructure exposed in the dev services menu.
 *
 * Returns an empty list in production.
 */
export function getDevServices(): DevServiceLink[] {
  if ((process.env.NODE_ENV ?? 'development') === 'production') {
    return [];
  }

  const appUrl = buildPublicUrl();
  const minioPublicEndpoint = buildMinioPublicEndpoint();
  const host = devHost();
  const minio = minioHost(minioPublicEndpoint);
  const mailpitUiPort = process.env.MAILPIT_UI_PORT?.trim() || '8025';
  const minioConsolePort = process.env.MINIO_CONSOLE_PORT?.trim() || '9001';
  const prismaStudioPort = process.env.PRISMA_STUDIO_PORT?.trim() || '5555';

  return [
    {
      id: 'app',
      label: 'Web app',
      url: appUrl,
      description: 'This UI',
    },
    {
      id: 'docs',
      label: 'API docs',
      url: '/docs/',
      description: 'Admin only',
    },
    {
      id: 'mailpit',
      label: 'Mailpit',
      url: httpUrl(host, mailpitUiPort),
      description: 'Email inbox',
    },
    {
      id: 'minio-console',
      label: 'MinIO console',
      url: httpUrl(minio, minioConsolePort),
      description: 'Object storage',
    },
    {
      id: 'minio-api',
      label: 'MinIO API',
      url: minioPublicEndpoint,
      description: 'S3 endpoint',
    },
    {
      id: 'prisma-studio',
      label: 'Prisma Studio',
      url: httpUrl(host, prismaStudioPort),
      description: 'Run npm run db:studio first (local DB UI)',
    },
  ];
}
