/**
 * Parses JSON string arrays from environment variables.
 *
 * @packageDocumentation
 */

/**
 * @param raw - JSON array string from the environment
 * @param fallback - Used when unset or invalid
 */
export function parseJsonStringArray(raw: string | undefined, fallback: string[]): string[] {
  if (!raw?.trim()) {
    return [...fallback];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === 'string')) {
      throw new Error('Expected JSON array of strings');
    }
    return parsed.map((entry) => entry.trim().toLowerCase());
  } catch {
    console.warn('[env] Invalid JSON string array; using fallback.');
    return [...fallback];
  }
}
