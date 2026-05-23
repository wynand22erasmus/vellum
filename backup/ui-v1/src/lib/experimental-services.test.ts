import { describe, expect, it } from 'vitest';
import {
  buildExperimentalLinks,
  resolveExperimentalUrl,
} from './experimental-services.ts';
import type { DevServiceLink } from './dev-services.ts';

const services: DevServiceLink[] = [
  { id: 'app', label: 'Web app', url: 'http://localhost:5174' },
  { id: 'docs', label: 'API docs', url: '/docs/' },
  { id: 'mailpit', label: 'Mailpit', url: 'http://localhost:8025' },
];

describe('experimental-services', () => {
  it('maps web services to in-app experimental routes (positive)', () => {
    const links = buildExperimentalLinks(services);
    expect(links).toHaveLength(2);
    expect(links.every((link) => link.embed)).toBe(true);
    expect(links.map((link) => link.href)).toEqual([
      '/experimental/docs',
      '/experimental/mailpit',
    ]);
    expect(links.every((link) => !link.href.includes('app'))).toBe(true);
  });

  it('resolves experimental service by id (positive)', () => {
    expect(resolveExperimentalUrl('mailpit', services)?.label).toBe('Mailpit');
    expect(resolveExperimentalUrl('missing', services)).toBeUndefined();
  });
});
