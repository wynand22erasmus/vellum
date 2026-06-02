/**
 * Maps unknown errors to RFC 9457 Problem Details shape.
 *
 * @packageDocumentation
 */

import { ZodError } from 'zod';
import type { MulterError } from 'multer';
import { Prisma } from '../../../generated/client.ts';
import { AppError } from './app-error.ts';
import { toOrphanExtension } from '../compensation/orphan.ts';
import type { OrphanedResource } from '../compensation/orphan.ts';

/** RFC 9457 Problem Details body (with extension members). */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

export interface ProblemFromErrorContext {
  instance?: string;
  requestId?: string;
}

/**
 * Converts any thrown value into a Problem Details object and optional internal metadata.
 *
 * @param err - Caught error
 * @param ctx - Request context for `instance` / logging
 */
export function problemFromError(
  err: unknown,
  ctx: ProblemFromErrorContext = {},
): { problem: ProblemDetails; internal: Record<string, unknown> } {
  if (err instanceof AppError) {
    const extensions = { ...err.extensions };
    if (err.orphanedResources?.length) {
      Object.assign(extensions, toOrphanExtension(err.orphanedResources));
    }
    return {
      problem: {
        type: err.type,
        title: err.title,
        status: err.status,
        detail: err.detail,
        instance: ctx.instance,
        ...extensions,
      },
      internal: buildInternal(err, ctx),
    };
  }

  if (err instanceof ZodError) {
    const appErr = AppError.badRequest('Validation failed.', {
      invalidParams: err.flatten(),
    });
    return {
      problem: {
        type: appErr.type,
        title: appErr.title,
        status: appErr.status,
        detail: appErr.detail,
        instance: ctx.instance,
        invalidParams: err.flatten(),
      },
      internal: buildInternal(err, ctx),
    };
  }

  if (isMulterError(err)) {
    const detail =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File exceeds the maximum upload size.'
        : `Upload error: ${err.message}`;
    const appErr = AppError.badRequest(detail);
    return {
      problem: {
        type: appErr.type,
        title: appErr.title,
        status: appErr.status,
        detail: appErr.detail,
        instance: ctx.instance,
      },
      internal: buildInternal(err, ctx),
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const appErr = AppError.internal('A database error occurred.');
    return {
      problem: {
        type: appErr.type,
        title: appErr.title,
        status: appErr.status,
        detail: appErr.detail,
        instance: ctx.instance,
      },
      internal: { ...buildInternal(err, ctx), prismaCode: err.code },
    };
  }

  const appErr = AppError.internal();
  return {
    problem: {
      type: appErr.type,
      title: appErr.title,
      status: appErr.status,
      detail: appErr.detail,
      instance: ctx.instance,
    },
    internal: buildInternal(err, ctx),
  };
}

function buildInternal(
  err: unknown,
  ctx: ProblemFromErrorContext,
): Record<string, unknown> {
  const internal: Record<string, unknown> = {
    requestId: ctx.requestId,
  };
  if (err instanceof AppError) {
    if (err.internal) Object.assign(internal, err.internal);
    if (err.orphanedResources?.length) {
      internal.orphanedResources = err.orphanedResources;
    }
  }
  if (err instanceof Error) {
    internal.stack = err.stack;
    if (err.cause) {
      internal.cause = err.cause instanceof Error ? err.cause.message : String(err.cause);
    }
  } else {
    internal.raw = String(err);
  }
  return internal;
}

function isMulterError(err: unknown): err is MulterError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err as MulterError).name === 'MulterError'
  );
}

export type { OrphanedResource };
