/**
 * Maps unknown errors to RFC 9457 Problem Details shape.
 *
 * @packageDocumentation
 */

import { ZodError } from 'zod';
import type { MulterError } from 'multer';
import { Prisma } from '../../../generated/client.ts';
import { AppError } from './app-error.ts';
import { validationErrorFromZod } from './validation-detail.ts';
import { toOrphanExtension } from '../compensation/orphan.ts';
import type { OrphanedResource } from '../compensation/orphan.ts';
import { env } from '../env.ts';

/** RFC 9457 Problem Details body (with extension members). */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

/** Request-scoped values passed when mapping errors to Problem Details. */
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
    const appErr = validationErrorFromZod(err);
    return {
      problem: {
        type: appErr.type,
        title: appErr.title,
        status: appErr.status,
        detail: appErr.detail,
        instance: ctx.instance,
        ...(appErr.extensions.invalidParams
          ? { invalidParams: appErr.extensions.invalidParams }
          : {}),
      },
      internal: buildInternal(err, ctx),
    };
  }

  if (isMulterError(err)) {
    const appErr = multerToAppError(err);
    return {
      problem: {
        type: appErr.type,
        title: appErr.title,
        status: appErr.status,
        detail: appErr.detail,
        instance: ctx.instance,
        ...appErr.extensions,
      },
      internal: buildInternal(err, ctx),
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const appErr = prismaToAppError(err);
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

function multerToAppError(err: MulterError): AppError {
  if (err.code === 'LIMIT_FILE_SIZE') {
    const maxMb = Math.round(env.maxUploadBytes / (1024 * 1024));
    return AppError.uploadRejected(
      `Uploaded file exceeds the maximum allowed size of ${maxMb} MB (${env.maxUploadBytes} bytes).`,
      { multerCode: err.code, maxUploadBytes: env.maxUploadBytes },
    );
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return AppError.badRequest(
      `Unexpected upload field "${err.field ?? 'unknown'}". Use the multipart field name "file".`,
      { multerCode: err.code },
    );
  }
  return AppError.badRequest(`Multipart upload error (${err.code}): ${err.message}.`, {
    multerCode: err.code,
  });
}

function prismaToAppError(err: Prisma.PrismaClientKnownRequestError): AppError {
  if (err.code === 'P2025') {
    const model = typeof err.meta?.modelName === 'string' ? err.meta.modelName : 'record';
    return AppError.notFound(`The requested ${model} was not found or has already been deleted.`);
  }
  if (err.code === 'P2002') {
    const target = err.meta?.target;
    const fields =
      Array.isArray(target) && target.length > 0
        ? target.join(', ')
        : 'unique field';
    return AppError.badRequest(
      `A record with the same value already exists for: ${fields}.`,
    );
  }
  return AppError.internal('A database error occurred while processing the request.');
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
