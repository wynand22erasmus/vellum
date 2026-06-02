/**
 * Structured process-error logger (NDJSON file stream).
 *
 * @packageDocumentation
 */

import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import { env } from '../env.ts';

/** @internal */
let logger: pino.Logger | null = null;

function getLogger(): pino.Logger {
  if (logger) {
    return logger;
  }
  fs.mkdirSync(env.logDir, { recursive: true });
  const filePath = path.join(env.logDir, 'process-errors.ndjson');
  logger = pino(
    { level: 'info', base: null, timestamp: pino.stdTimeFunctions.isoTime },
    pino.destination({ dest: filePath, sync: true, mkdir: true }),
  );
  return logger;
}

/**
 * Appends one process-error record to the NDJSON log file.
 *
 * @param record - Serializable error payload
 */
export function appendProcessErrorLog(record: Record<string, unknown>): void {
  try {
    getLogger().info(record);
  } catch {
    // Best-effort only — must not throw to callers
  }
}
