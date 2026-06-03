/**
 * Serialized filter values for {@link DataTable} column filters.
 *
 * @packageDocumentation
 */

const MULTI_SELECT_PREFIX = '\x1e';

/**
 * Serializes multiselect values for storage in `columnFilters` state.
 */
export function serializeMultiSelectFilterValue(values: readonly string[]): string {
  if (values.length === 0) {
    return '';
  }
  return `${MULTI_SELECT_PREFIX}${JSON.stringify(values)}`;
}

/**
 * Parses a multiselect filter value from `columnFilters` state.
 */
export function parseMultiSelectFilterValue(raw: string): string[] {
  if (!raw) {
    return [];
  }
  if (raw.startsWith(MULTI_SELECT_PREFIX)) {
    try {
      const parsed: unknown = JSON.parse(raw.slice(MULTI_SELECT_PREFIX.length));
      if (Array.isArray(parsed)) {
        return parsed.filter((entry): entry is string => typeof entry === 'string');
      }
    } catch {
      return [];
    }
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((entry): entry is string => typeof entry === 'string');
    }
  } catch {
    // Legacy single-value filters.
  }
  return raw.trim() ? [raw.trim()] : [];
}

/**
 * Returns whether a column filter value is considered active.
 */
export function isDataTableFilterActive(
  raw: string,
  filterType: 'text' | 'multiselect',
): boolean {
  if (filterType === 'multiselect') {
    return parseMultiSelectFilterValue(raw).length > 0;
  }
  return Boolean(raw.trim());
}

/**
 * Maps multiselect values to a comma-separated query param, or `undefined` when empty.
 */
export function multiSelectToQueryParam(values: readonly string[]): string | undefined {
  if (values.length === 0) {
    return undefined;
  }
  return values.join(',');
}

/**
 * When every allowed enum value is selected, treat as no filter.
 */
export function enumMultiSelectForQuery<T extends string>(
  selected: readonly string[],
  allowedWithoutAll: readonly T[],
): T[] | undefined {
  const valid = selected.filter((value): value is T =>
    allowedWithoutAll.includes(value as T),
  );
  if (valid.length === 0 || valid.length >= allowedWithoutAll.length) {
    return undefined;
  }
  return valid;
}

/**
 * Maps boolean multiselect (`true` / `false`) to a single API boolean when exactly one is chosen.
 */
export function booleanMultiSelectForQuery(
  selected: readonly string[],
): boolean | undefined {
  const hasTrue = selected.includes('true');
  const hasFalse = selected.includes('false');
  if (hasTrue && !hasFalse) {
    return true;
  }
  if (hasFalse && !hasTrue) {
    return false;
  }
  return undefined;
}
