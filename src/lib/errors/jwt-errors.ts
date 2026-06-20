/**
 * Maps jose JWT verification failures to `AppError`.
 *
 * @packageDocumentation
 */

import { errors as joseErrors } from 'jose';
import { AppError } from './app-error.ts';

/**
 * Converts jose verification errors into operational `AppError` instances.
 *
 * @param err - Error from `jwtVerify`
 * @param context - Which auth token flow failed
 */
export function appErrorFromJwtVerify(
  err: unknown,
  context: 'email-verification' | 'pending-verification',
): AppError {
  if (err instanceof joseErrors.JWTExpired) {
    if (context === 'email-verification') {
      return AppError.gone(
        'This email verification link has expired. Sign in again and request a new verification email if needed.',
      );
    }
    return AppError.gone(
      'This verification session has expired. Sign in again to request a new verification email.',
    );
  }

  if (
    err instanceof joseErrors.JWTInvalid ||
    err instanceof joseErrors.JWSInvalid ||
    err instanceof joseErrors.JWTClaimValidationFailed
  ) {
    if (context === 'email-verification') {
      return AppError.badRequest(
        'The email verification link is invalid, malformed, or has been tampered with.',
      );
    }
    return AppError.badRequest(
      'The pending verification token is invalid, malformed, or has been tampered with.',
    );
  }

  if (err instanceof AppError) {
    return err;
  }

  return AppError.badRequest(
    context === 'email-verification'
      ? 'The email verification link could not be validated.'
      : 'The pending verification token could not be validated.',
  );
}
