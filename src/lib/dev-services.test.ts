import { afterEach, describe, expect, it } from 'vitest';
import { getDevServices } from './dev-services.ts';

const envKeys = [
  'NODE_ENV',
  'VELLUM_HOST',
  'APP_URL',
  'MINIO_ENDPOINT',
  'MINIO_PUBLIC_ENDPOINT',
  'MAILPIT_UI_PORT',
  'MINIO_CONSOLE_PORT',
] as const;

function clearDevServicesEnv(): void {
  for (const key of envKeys) {
    delete process.env[key];
  }
}

describe('getDevServices', () => {
  afterEach(() => {
    clearDevServicesEnv();
  });

  it('returns an empty list in production', () => {
    process.env.NODE_ENV = 'production';
    expect(getDevServices()).toEqual([]);
  });

  it('includes Mailpit and MinIO links for local development', () => {
    process.env.NODE_ENV = 'development';
    const services = getDevServices();
    const byId = Object.fromEntries(services.map((service) => [service.id, service]));

    expect(byId.mailpit?.url).toBe('http://localhost:8025');
    expect(byId['minio-console']?.url).toBe('http://localhost:9001');
    expect(byId['minio-api']?.url).toBe('http://localhost:9000');
    expect(byId.docs?.url).toBe('/docs/');
  });

  it('uses VELLUM_HOST for Mailpit when set', () => {
    process.env.NODE_ENV = 'development';
    process.env.VELLUM_HOST = 'devman.wtfgang.win';
    process.env.MINIO_ENDPOINT = 'http://minio:9000';

    const services = getDevServices();
    const byId = Object.fromEntries(services.map((service) => [service.id, service]));

    expect(byId.mailpit?.url).toBe('http://devman.wtfgang.win:8025');
    expect(byId['minio-console']?.url).toBe('http://devman.wtfgang.win:9001');
    expect(byId['minio-api']?.url).toBe('http://devman.wtfgang.win:9000');
  });
});
