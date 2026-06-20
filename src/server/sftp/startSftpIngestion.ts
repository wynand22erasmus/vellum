/**
 * Bootstraps SFTP inbox ingestion when {@link env.sftpEnabled} is true.
 *
 * @packageDocumentation
 */

import { env } from '../../lib/env.ts';
import { ensureSftpDirectories, startSftpInboxWatcher } from './inboxWatcher.ts';

/** Initializes SFTP directories and starts the inbox watcher when enabled. */
export async function startSftpIngestion(): Promise<void> {
  if (!env.sftpEnabled) {
    return;
  }

  await ensureSftpDirectories();
  startSftpInboxWatcher();
}
