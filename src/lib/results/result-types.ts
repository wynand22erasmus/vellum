/**
 * Vellum success result type catalog.
 *
 * @packageDocumentation
 */

/** Base URL for stable `type` URIs in success result responses. */
export const RESULT_TYPE_BASE_URL =
  process.env.RESULT_TYPE_BASE_URL ?? 'https://vellum.dev/results';

/** Slug → fixed title for each result type. */
export const RESULT_TITLES = {
  ok: 'OK',
  created: 'Created',
  accepted: 'Accepted',
} as const;

/** Slug for a catalogued success result `type` URI. */
export type ResultTypeSlug = keyof typeof RESULT_TITLES;

/** Default HTTP status for each result type slug. */
export const RESULT_STATUS: Record<ResultTypeSlug, number> = {
  ok: 200,
  created: 201,
  accepted: 202,
};

/** Builds the canonical `type` URI for a result slug. */
export function resultTypeUri(slug: ResultTypeSlug): string {
  return `${RESULT_TYPE_BASE_URL}/${slug}`;
}
