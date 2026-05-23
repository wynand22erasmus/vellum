export const ADMIN_BOOLEAN_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

export const ADMIN_USER_KIND_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'CONSUMER', label: 'Consumer' },
] as const;

export const ADMIN_ISO_DATE_PLACEHOLDER = '2026-01-01T00:00:00.000Z';

function optionalTrimmed(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function optionalSelectValue(value: string): string | undefined {
  return optionalTrimmed(value);
}

export function optionalBooleanQueryValue(value: string): string | undefined {
  if (value === 'true' || value === 'false') {
    return value;
  }
  return undefined;
}

export function emptyAdminFilterValues(ids: readonly string[]): Record<string, string> {
  return Object.fromEntries(ids.map((id) => [id, '']));
}
