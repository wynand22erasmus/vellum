/**
 * Builds verbose validation error messages from Zod failures.
 *
 * @packageDocumentation
 */

import type { ZodError, ZodFlattenedError } from 'zod';
import { AppError } from './app-error.ts';

/**
 * Summarizes a flattened Zod error as a single human-readable string.
 *
 * @param flattened - Output of `ZodError.flatten()`
 */
export function formatInvalidParamsSummary(
  flattened: ZodFlattenedError<unknown, string>,
): string {
  const parts: string[] = [];
  for (const formError of flattened.formErrors) {
    parts.push(formError);
  }
  for (const [field, errors] of Object.entries(flattened.fieldErrors)) {
    if (errors?.length) {
      parts.push(`${field}: ${errors.join(', ')}`);
    }
  }
  return parts.join('; ');
}

/**
 * Maps a Zod failure to {@link AppError.badRequest} with `invalidParams` extension.
 *
 * @param err - Zod validation error
 * @param preamble - Prefix before field-level summary
 */
export function validationErrorFromZod(
  err: ZodError,
  preamble = 'Validation failed.',
): AppError {
  const invalidParams = err.flatten();
  const summary = formatInvalidParamsSummary(invalidParams);
  const detail = summary ? `${preamble} ${summary}` : preamble;
  return AppError.badRequest(detail, { invalidParams });
}
