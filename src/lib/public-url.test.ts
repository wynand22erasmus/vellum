import { afterEach, describe, expect, it } from 'vitest';
import {
  buildMinioPublicEndpoint,
  buildPublicUrl,
  buildWorkosRedirectUri,
} from './public-url.ts';

const envKeys = [
  'APP_URL',
  'VELLUM_HOST',
  'VELLUM_PUBLIC_SCHEME',
  'VELLUM_PUBLIC_PORT',
  'WORKOS_REDIRECT_URI',
  'MINIO_ENDPOINT',
  'MINIO_PUBLIC_ENDPOINT',
  'MINIO_HOST_PORT',
] as const;

function clearUrlEnv(): void {
  for (const key of envKeys) {
    delete process.env[key];
  }
}

describe('buildPublicUrl', () => {
  afterEach(() => {
    clearUrlEnv();
  });

  it('prefers APP_URL when set', () => {
    process.env.APP_URL = 'https://app.example.com/';
    expect(buildPublicUrl()).toBe('https://app.example.com');
  });

  it('defaults localhost to port 8580', () => {
    expect(buildPublicUrl()).toBe('http://localhost:8580');
  });

  it('builds URL from VELLUM_HOST and public port', () => {
    process.env.VELLUM_HOST = 'devman.wtfgang.win';
    process.env.VELLUM_PUBLIC_PORT = '8580';
    expect(buildPublicUrl()).toBe('http://devman.wtfgang.win:8580');
  });

  it('omits standard https port', () => {
    process.env.VELLUM_HOST = 'vellum.example.com';
    process.env.VELLUM_PUBLIC_SCHEME = 'https';
    process.env.VELLUM_PUBLIC_PORT = '443';
    expect(buildPublicUrl()).toBe('https://vellum.example.com');
  });
});

describe('buildMinioPublicEndpoint', () => {
  afterEach(() => {
    clearUrlEnv();
  });

  it('prefers MINIO_PUBLIC_ENDPOINT when set', () => {
    process.env.MINIO_PUBLIC_ENDPOINT = 'https://cdn.example.com/';
    expect(buildMinioPublicEndpoint()).toBe('https://cdn.example.com');
  });

  it('rewrites internal minio hostname using VELLUM_HOST', () => {
    process.env.MINIO_ENDPOINT = 'http://minio:9000';
    process.env.VELLUM_HOST = 'devman.wtfgang.win';
    expect(buildMinioPublicEndpoint()).toBe('http://devman.wtfgang.win:8500');
  });

  it('defaults internal minio to localhost when VELLUM_HOST unset', () => {
    process.env.MINIO_ENDPOINT = 'http://minio:9000';
    expect(buildMinioPublicEndpoint()).toBe('http://localhost:8500');
  });

  it('passes through localhost MINIO_ENDPOINT unchanged', () => {
    process.env.MINIO_ENDPOINT = 'http://localhost:8500';
    expect(buildMinioPublicEndpoint()).toBe('http://localhost:8500');
  });
});

describe('buildWorkosRedirectUri', () => {
  afterEach(() => {
    clearUrlEnv();
  });

  it('derives callback from public URL', () => {
    process.env.VELLUM_HOST = 'devman.wtfgang.win';
    process.env.VELLUM_PUBLIC_PORT = '8580';
    expect(buildWorkosRedirectUri()).toBe(
      'http://devman.wtfgang.win:8580/api/auth/callback',
    );
  });
});
