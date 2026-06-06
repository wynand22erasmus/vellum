/**
 * Application error type thrown by routes, middleware, and domain code.
 *
 * @packageDocumentation
 */

import type { OrphanedResource } from '../compensation/orphan.ts';
import {
  PROBLEM_STATUS,
  PROBLEM_TITLES,
  problemTypeUri,
  type ProblemTypeSlug,
} from './problem-types.ts';

/** Constructor options for `AppError`. */
export interface AppErrorOptions {
  detail?: string;
  extensions?: Record<string, unknown>;
  orphanedResources?: OrphanedResource[];
  internal?: Record<string, unknown>;
  cause?: unknown;
}

/**
 * Typed operational error mapped to RFC 9457 Problem Details by the global handler.
 */
export class AppError extends Error {
  readonly slug: ProblemTypeSlug;
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly extensions: Record<string, unknown>;
  readonly orphanedResources?: OrphanedResource[];
  readonly internal?: Record<string, unknown>;

  constructor(slug: ProblemTypeSlug, detail: string, options: AppErrorOptions = {}) {
    super(detail);
    this.name = 'AppError';
    this.slug = slug;
    this.status = PROBLEM_STATUS[slug];
    this.title = PROBLEM_TITLES[slug];
    this.detail = options.detail ?? detail;
    this.extensions = { ...(options.extensions ?? {}) };
    this.orphanedResources = options.orphanedResources;
    this.internal = options.internal;
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }

  /** Canonical RFC 9457 `type` URI. */
  get type(): string {
    return problemTypeUri(this.slug);
  }

  static badRequest(detail: string, extensions?: Record<string, unknown>): AppError {
    return new AppError('validation-error', detail, { extensions });
  }

  static unauthorized(detail = 'Authentication required.'): AppError {
    return new AppError('unauthorized', detail);
  }

  static forbidden(detail = 'Access denied.', extensions?: Record<string, unknown>): AppError {
    return new AppError('forbidden', detail, { extensions });
  }

  /** Sign-in blocked until the user verifies their email (`reason: EMAIL_NOT_VERIFIED`). */
  static emailNotVerified(
    detail = 'Email address must be verified before signing in. Check your inbox for a verification link or request a new one from the sign-in page.',
  ): AppError {
    return AppError.forbidden(detail, { reason: 'EMAIL_NOT_VERIFIED' });
  }

  static notFound(detail = 'Resource not found.'): AppError {
    return new AppError('not-found', detail);
  }

  static gone(detail: string, extensions?: Record<string, unknown>): AppError {
    return new AppError('gone', detail, { extensions });
  }

  static unprocessableContent(detail: string, extensions?: Record<string, unknown>): AppError {
    return new AppError('unprocessable-content', detail, { extensions });
  }

  static tooManyRequests(detail = 'Too many requests.'): AppError {
    return new AppError('too-many-requests', detail);
  }

  static internal(detail = 'An unexpected server error occurred. Please try again later.', options: AppErrorOptions = {}): AppError {
    return new AppError('internal-error', detail, options);
  }

  static serviceUnavailable(detail: string, extensions?: Record<string, unknown>): AppError {
    return new AppError('service-unavailable', detail, { extensions });
  }

  static uploadRejected(detail: string, extensions?: Record<string, unknown>): AppError {
    return new AppError('upload-rejected', detail, { extensions });
  }

  static partialFailure(detail: string, options: AppErrorOptions = {}): AppError {
    const extensions = {
      ...(options.extensions ?? {}),
      ...(options.orphanedResources
        ? {
            orphanedResources: options.orphanedResources,
            compensationAttempted: true,
            compensationFailed: true,
          }
        : {}),
    };
    return new AppError('partial-failure', detail, { ...options, extensions });
  }
}

/** @deprecated Use {@link AppError.badRequest} */
export const badRequest = AppError.badRequest.bind(AppError);
/** @deprecated Use {@link AppError.unauthorized} */
export const unauthorized = AppError.unauthorized.bind(AppError);
/** @deprecated Use {@link AppError.forbidden} */
export const forbidden = AppError.forbidden.bind(AppError);
/** @deprecated Use {@link AppError.notFound} */
export const notFound = AppError.notFound.bind(AppError);
/** @deprecated Use {@link AppError.gone} */
export const gone = AppError.gone.bind(AppError);
/** @deprecated Use {@link AppError.tooManyRequests} */
export const tooManyRequests = AppError.tooManyRequests.bind(AppError);
/** @deprecated Use {@link AppError.internal} */
export const internalError = AppError.internal.bind(AppError);
/** @deprecated Use {@link AppError.serviceUnavailable} */
export const serviceUnavailable = AppError.serviceUnavailable.bind(AppError);
