/**
 * Polls the SFTP inbox for complete file + manifest pairs.
 *
 * @packageDocumentation
 */

import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../lib/env.ts';
import { ingestSftpFile } from './ingestSftpFile.ts';
import { manifestPathForFile } from './parseManifest.ts';

/** @internal */
type StableEntry = {
  size: number;
  seenAt: number;
};

/** @internal */
const stableSizes = new Map<string, StableEntry>();
/** @internal */
const inFlight = new Set<string>();

/**
 * Ensures inbox, archive, and failed directories exist.
 */
export async function ensureSftpDirectories(): Promise<void> {
  await Promise.all([
    mkdir(env.sftpInboxPath, { recursive: true }),
    mkdir(env.sftpArchivePath, { recursive: true }),
    mkdir(env.sftpFailedPath, { recursive: true }),
  ]);
}

function isManifestFile(name: string): boolean {
  return name.endsWith(env.sftpManifestSuffix);
}

async function fileSizeStable(filePath: string): Promise<boolean> {
  let stats;
  try {
    stats = await stat(filePath);
  } catch {
    return false;
  }

  if (!stats.isFile()) {
    return false;
  }

  const now = Date.now();
  const prev = stableSizes.get(filePath);
  if (prev && prev.size === stats.size && now - prev.seenAt >= env.sftpStableFileMs) {
    return true;
  }

  stableSizes.set(filePath, { size: stats.size, seenAt: now });
  return false;
}

async function processReadyPair(filePath: string): Promise<void> {
  if (inFlight.has(filePath)) {
    return;
  }

  const manifestPath = manifestPathForFile(filePath, env.sftpManifestSuffix);
  try {
    const [fileStats, manifestStats] = await Promise.all([stat(filePath), stat(manifestPath)]);
    if (!fileStats.isFile() || !manifestStats.isFile()) {
      return;
    }
  } catch {
    return;
  }

  const [fileStable, manifestStable] = await Promise.all([
    fileSizeStable(filePath),
    fileSizeStable(manifestPath),
  ]);
  if (!fileStable || !manifestStable) {
    return;
  }

  inFlight.add(filePath);
  stableSizes.delete(filePath);
  stableSizes.delete(manifestPath);

  try {
    await ingestSftpFile({
      filePath,
      manifestPath,
      sftpUser: env.sftpUser,
    });
  } finally {
    inFlight.delete(filePath);
  }
}

/**
 * Scans the inbox once for ingestible file + manifest pairs.
 */
export async function scanSftpInboxOnce(): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(env.sftpInboxPath);
  } catch {
    return;
  }

  const candidates = entries.filter((name) => !isManifestFile(name));
  await Promise.all(
    candidates.map(async (name) => {
      const filePath = path.join(env.sftpInboxPath, name);
      try {
        const stats = await stat(filePath);
        if (!stats.isFile()) {
          return;
        }
      } catch {
        return;
      }
      await processReadyPair(filePath);
    }),
  );
}

/** Starts polling the SFTP inbox until the process exits. */
export function startSftpInboxWatcher(): void {
  const tick = () => {
    scanSftpInboxOnce().catch((err) => {
      console.error('[SFTP] Inbox scan failed:', err instanceof Error ? err.message : err);
    });
  };

  tick();
  setInterval(tick, env.sftpPollIntervalMs);
  console.log(
    `[SFTP] Watching ${env.sftpInboxPath} every ${env.sftpPollIntervalMs}ms (user: ${env.sftpUser})`,
  );
}
