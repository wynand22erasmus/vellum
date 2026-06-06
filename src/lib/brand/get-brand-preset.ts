/**
 * Server-side brand preset loader from `BRAND_PRESET` env.
 *
 * @packageDocumentation
 */

import { getBrandPreset as resolvePreset } from './presets.ts';

/** Load the active brand preset for Node (email, etc.). */
export function getBrandPresetFromEnv(): ReturnType<typeof resolvePreset> {
  return resolvePreset(process.env.BRAND_PRESET);
}
