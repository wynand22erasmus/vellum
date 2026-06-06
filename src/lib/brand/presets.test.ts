/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import { getBrandPreset, brandPresets } from './presets.ts';

describe('getBrandPreset', () => {
  it('returns vellum by default', () => {
    expect(getBrandPreset().id).toBe('vellum');
  });

  it('returns client-example when requested', () => {
    expect(getBrandPreset('client-example').displayName).toBe('Acme Secure Transfer');
  });

  it('falls back to vellum for unknown ids', () => {
    expect(getBrandPreset('unknown-client').id).toBe('vellum');
  });

  it('registers all expected presets', () => {
    expect(Object.keys(brandPresets).sort()).toEqual(['client-example', 'vellum']);
  });
});
