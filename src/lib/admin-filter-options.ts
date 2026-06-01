/**
 * Shared select options and query helpers for admin table filters.
 *
 * @packageDocumentation
 */

/** Yes/no/all options for boolean admin filters. */
export const ADMIN_BOOLEAN_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

/** Role filter options for the admin users table. */
export const ADMIN_USER_KIND_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'CONSUMER', label: 'Consumer' },
] as const;

/** Placeholder hint for ISO-8601 datetime filter inputs. */
export const ADMIN_ISO_DATE_PLACEHOLDER = '2026-01-01T00:00:00.000Z';

function optionalTrimmed(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Returns a trimmed select value, or `undefined` when empty.
 *
 * @param value - Raw select input value
 */
export function optionalSelectValue(value: string): string | undefined {
  return optionalTrimmed(value);
}

/**
 * Returns a boolean query value when valid, or `undefined` for “all”.
 *
 * @param value - Raw select input value (`true`, `false`, or empty)
 */
export function optionalBooleanQueryValue(value: string): string | undefined {
  if (value === 'true' || value === 'false') {
    return value;
  }
  return undefined;
}

/**
 * Builds an empty filter form state keyed by field ids.
 *
 * @param ids - Filter field identifiers
 */
export function emptyAdminFilterValues(ids: readonly string[]): Record<string, string> {
  return Object.fromEntries(ids.map((id) => [id, '']));
}
