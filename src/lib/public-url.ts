/**
 * Builds public-facing URLs from `VELLUM_HOST` and related env vars.
 *
 * @packageDocumentation
 * @see docs/CONFIG.md
 */

/**
 * Public base URL for the app (no trailing slash).
 *
 * Uses `APP_URL` when set; otherwise derives from `VELLUM_HOST`, `VELLUM_PUBLIC_SCHEME`,
 * and `VELLUM_PUBLIC_PORT`.
 */
export function buildPublicUrl(): string {
  const explicit = process.env.APP_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const host = process.env.VELLUM_HOST?.trim() || 'localhost';
  const scheme = (process.env.VELLUM_PUBLIC_SCHEME?.trim() || 'http').replace(/:$/, '');
  const port = process.env.VELLUM_PUBLIC_PORT?.trim();

  const implicitPort =
    port ?? (host === 'localhost' || host === '127.0.0.1' ? '5174' : '');

  const standardPort = scheme === 'https' ? '443' : '80';
  const base = `${scheme}://${host}`;
  if (!implicitPort || implicitPort === standardPort) {
    return base;
  }
  return `${base}:${implicitPort}`;
}

/**
 * Browser-reachable MinIO/S3 base URL for presigned downloads.
 *
 * Uses `MINIO_PUBLIC_ENDPOINT` when set. When `MINIO_ENDPOINT` uses the internal
 * Compose hostname `minio`, derives `http://{VELLUM_HOST}:9000` so signatures match
 * what the user's browser can resolve.
 */
export function buildMinioPublicEndpoint(): string {
  const explicit = process.env.MINIO_PUBLIC_ENDPOINT?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const internal = (process.env.MINIO_ENDPOINT ?? 'http://localhost:9000').trim();
  try {
    const url = new URL(internal);
    if (url.hostname === 'minio') {
      const host = process.env.VELLUM_HOST?.trim() || 'localhost';
      url.hostname = host;
      return url.toString().replace(/\/$/, '');
    }
  } catch {
    // fall through to internal endpoint
  }
  return internal.replace(/\/$/, '');
}

/**
 * WorkOS OAuth callback URL.
 *
 * Uses `WORKOS_REDIRECT_URI` when set; otherwise `{@link buildPublicUrl}/api/auth/callback`.
 */
export function buildWorkosRedirectUri(): string {
  const explicit = process.env.WORKOS_REDIRECT_URI?.trim();
  if (explicit) {
    return explicit;
  }
  return `${buildPublicUrl()}/api/auth/callback`;
}
