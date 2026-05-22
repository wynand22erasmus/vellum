import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildExperimentalLinks,
  resolveExperimentalUrl,
} from './experimental-services.ts';
import type { DevServiceLink } from './dev-services.ts';

const services: DevServiceLink[] = [
  { id: 'app', label: 'Web app', url: 'http://localhost:5173' },
  { id: 'docs', label: 'API docs', url: '/docs/' },
  { id: 'mailpit', label: 'Mailpit', url: 'http://localhost:8025' },
];

describe('experimental-services', () => {
  it('maps web services to in-app experimental routes (positive)', () => {
    const links = buildExperimentalLinks(services);
    assert.equal(links.length, 2);
    assert.ok(links.every((link) => link.embed));
    assert.deepEqual(
      links.map((link) => link.href),
      ['/experimental/docs', '/experimental/mailpit'],
    );
    assert.ok(links.every((link) => !link.href.includes('app')));
  });

  it('resolves experimental service by id (positive)', () => {
    assert.equal(resolveExperimentalUrl('mailpit', services)?.label, 'Mailpit');
    assert.equal(resolveExperimentalUrl('missing', services), undefined);
  });
});
