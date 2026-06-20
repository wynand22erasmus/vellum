/**
 * LIFO compensation stack for multi-step DB/S3 mutations.
 *
 * @packageDocumentation
 */

import type { OrphanedResource } from './orphan.ts';
import { compensationFailedError } from './orphan.ts';
import { AppError } from '../errors/app-error.ts';

interface UndoEntry {
  label: string;
  fn: () => Promise<void>;
  orphanOnFail?: () => OrphanedResource | OrphanedResource[];
}

/**
 * Registers undo steps and runs them in reverse order when `main` throws.
 */
export class CompensationStack {
  private undos: UndoEntry[] = [];

  /**
   * Registers an undo step executed LIFO if a later step fails.
   *
   * @param label - Human-readable step name for logs
   * @param fn - Idempotent cleanup function
   * @param orphanOnFail - Resource descriptor if undo fails
   */
  registerUndo(
    label: string,
    fn: () => Promise<void>,
    orphanOnFail?: () => OrphanedResource | OrphanedResource[],
  ): void {
    this.undos.push({ label, fn, orphanOnFail });
  }

  /**
   * Runs `main`; on failure executes registered undos and rethrows or wraps orphans.
   *
   * @param main - Primary mutation sequence
   */
  async run<T>(main: () => Promise<T>): Promise<T> {
    try {
      return await main();
    } catch (err) {
      const orphans: OrphanedResource[] = [];
      const undoErrors: { label: string; error: string }[] = [];

      for (const undo of [...this.undos].reverse()) {
        try {
          await undo.fn();
        } catch (undoErr) {
          undoErrors.push({
            label: undo.label,
            error: undoErr instanceof Error ? undoErr.message : String(undoErr),
          });
          if (undo.orphanOnFail) {
            const described = undo.orphanOnFail();
            const list = Array.isArray(described) ? described : [described];
            orphans.push(...list);
          }
        }
      }

      if (undoErrors.length > 0) {
        throw compensationFailedError(err, orphans, userSafeMessage(err));
      }

      if (err instanceof AppError) {
        throw err;
      }
      throw AppError.internal(userSafeMessage(err));
    }
  }
}

function userSafeMessage(err: unknown): string {
  if (err instanceof AppError) {
    return err.detail;
  }
  return 'The operation failed.';
}

export { type OrphanedResource };
