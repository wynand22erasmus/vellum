/**
 * Download consumption and re-verify window logic for `/api/verify`.
 *
 * @packageDocumentation
 */

/** Document fields required to evaluate verify consumption. */
export type VerifyConsumptionDocument = {
  maxDownloads: number;
  downloadCount: number;
  verifySuccessCount: number;
  lastVerifiedAt: Date | null;
};

/** Outcome of a successful password verification. */
export type VerifyConsumptionUpdate = {
  verifySuccessCount: number;
  lastVerifiedAt: Date;
  downloadCount: number;
  reverifyAttempt: number;
  isFinalConsumption: boolean;
};

export type VerifyConsumptionConfig = {
  reverifyWindowMs: number;
  maxReverifyAttempts: number;
};

export type VerifyRejectionReason =
  | 'download_limit_reached'
  | 'link_consumed';

/**
 * Returns whether verify should be rejected before password check.
 */
export function getVerifyRejection(
  doc: VerifyConsumptionDocument,
  now: Date,
  config: VerifyConsumptionConfig,
): VerifyRejectionReason | null {
  if (doc.downloadCount >= doc.maxDownloads) {
    return 'download_limit_reached';
  }

  if (doc.lastVerifiedAt === null || doc.verifySuccessCount === 0) {
    return null;
  }

  const inWindow = now.getTime() - doc.lastVerifiedAt.getTime() < config.reverifyWindowMs;
  if (inWindow && doc.verifySuccessCount < config.maxReverifyAttempts) {
    return null;
  }

  return 'link_consumed';
}

/**
 * Computes post-success document update after issuing a presigned URL.
 */
export function computeVerifyConsumptionUpdate(
  doc: VerifyConsumptionDocument,
  now: Date,
  config: VerifyConsumptionConfig,
): VerifyConsumptionUpdate {
  const inWindow =
    doc.lastVerifiedAt !== null &&
    now.getTime() - doc.lastVerifiedAt.getTime() < config.reverifyWindowMs;

  const nextAttempt = inWindow ? doc.verifySuccessCount + 1 : 1;
  const isFinalConsumption = nextAttempt >= config.maxReverifyAttempts;
  const nextDownloadCount = isFinalConsumption ? doc.downloadCount + 1 : doc.downloadCount;

  let verifySuccessCount = nextAttempt;
  const lastVerifiedAt = now;

  if (isFinalConsumption && nextDownloadCount < doc.maxDownloads) {
    verifySuccessCount = 0;
  }

  return {
    verifySuccessCount,
    lastVerifiedAt,
    downloadCount: nextDownloadCount,
    reverifyAttempt: nextAttempt,
    isFinalConsumption,
  };
}
