/**
 * RFC 9457 Problem Details type catalog (single source of truth).
 *
 * @packageDocumentation
 */

/** Base URL for stable `type` URIs in Problem Details responses. */
export const PROBLEM_TYPE_BASE_URL =
  process.env.PROBLEM_TYPE_BASE_URL ?? 'https://vellum.dev/problems';

/** Slug → fixed title for each problem type. */
export const PROBLEM_TITLES = {
  'validation-error': 'Validation Error',
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  'not-found': 'Not Found',
  gone: 'Gone',
  'unprocessable-content': 'Unprocessable Content',
  'too-many-requests': 'Too Many Requests',
  'internal-error': 'Internal Server Error',
  'service-unavailable': 'Service Unavailable',
  'upload-rejected': 'Upload Rejected',
  'partial-failure': 'Partial Failure',
} as const;

/** Union of RFC 9457 problem type slugs defined in {@link PROBLEM_TITLES}. */
export type ProblemTypeSlug = keyof typeof PROBLEM_TITLES;

/** Default HTTP status for each problem type slug. */
export const PROBLEM_STATUS: Record<ProblemTypeSlug, number> = {
  'validation-error': 400,
  unauthorized: 401,
  forbidden: 403,
  'not-found': 404,
  gone: 410,
  'unprocessable-content': 422,
  'too-many-requests': 429,
  'internal-error': 500,
  'service-unavailable': 503,
  'upload-rejected': 400,
  'partial-failure': 500,
};

/**
 * Builds the canonical `type` URI for a problem slug.
 *
 * @param slug - Problem type identifier
 */
export function problemTypeUri(slug: ProblemTypeSlug): string {
  return `${PROBLEM_TYPE_BASE_URL}/${slug}`;
}
