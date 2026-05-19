import { afterEach, describe, expect, it } from 'vitest';
import { buildPublicUrl, buildWorkosRedirectUri } from './public-url.ts';

const envKeys = [
  'APP_URL',
  'VELLUM_HOST',
  'VELLUM_PUBLIC_SCHEME',
  'VELLUM_PUBLIC_PORT',
  'WORKOS_REDIRECT_URI',
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

  it('defaults localhost to port 5173', () => {
    expect(buildPublicUrl()).toBe('http://localhost:5173');
  });

  it('builds URL from VELLUM_HOST and public port', () => {
    process.env.VELLUM_HOST = 'devman.wtfgang.win';
    process.env.VELLUM_PUBLIC_PORT = '8080';
    expect(buildPublicUrl()).toBe('http://devman.wtfgang.win:8080');
  });

  it('omits standard https port', () => {
    process.env.VELLUM_HOST = 'vellum.example.com';
    process.env.VELLUM_PUBLIC_SCHEME = 'https';
    process.env.VELLUM_PUBLIC_PORT = '443';
    expect(buildPublicUrl()).toBe('https://vellum.example.com');
  });
});

describe('buildWorkosRedirectUri', () => {
  afterEach(() => {
    clearUrlEnv();
  });

  it('derives callback from public URL', () => {
    process.env.VELLUM_HOST = 'devman.wtfgang.win';
    process.env.VELLUM_PUBLIC_PORT = '8080';
    expect(buildWorkosRedirectUri()).toBe(
      'http://devman.wtfgang.win:8080/api/auth/callback',
    );
  });
});
