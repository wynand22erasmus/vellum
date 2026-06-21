import { describe, expect, it } from 'vitest';
import {
  computeVerifyConsumptionUpdate,
  getVerifyRejection,
} from './verify-consumption.ts';

const config = { reverifyWindowMs: 300_000, maxReverifyAttempts: 3 };

describe('getVerifyRejection', () => {
  it('rejects when download limit reached', () => {
    const reason = getVerifyRejection(
      {
        maxDownloads: 1,
        downloadCount: 1,
        verifySuccessCount: 3,
        lastVerifiedAt: new Date(),
      },
      new Date(),
      config,
    );
    expect(reason).toBe('download_limit_reached');
  });

  it('allows re-verify within window after prior success', () => {
    const now = new Date();
    const reason = getVerifyRejection(
      {
        maxDownloads: 1,
        downloadCount: 0,
        verifySuccessCount: 1,
        lastVerifiedAt: now,
      },
      now,
      config,
    );
    expect(reason).toBeNull();
  });
});

describe('computeVerifyConsumptionUpdate', () => {
  it('consumes download after max reverify attempts', () => {
    const now = new Date();
    const update = computeVerifyConsumptionUpdate(
      {
        maxDownloads: 1,
        downloadCount: 0,
        verifySuccessCount: 2,
        lastVerifiedAt: now,
      },
      now,
      config,
    );
    expect(update.reverifyAttempt).toBe(3);
    expect(update.isFinalConsumption).toBe(true);
    expect(update.downloadCount).toBe(1);
  });

  it('resets counters when multi-download remains', () => {
    const now = new Date();
    const update = computeVerifyConsumptionUpdate(
      {
        maxDownloads: 3,
        downloadCount: 0,
        verifySuccessCount: 2,
        lastVerifiedAt: now,
      },
      now,
      config,
    );
    expect(update.downloadCount).toBe(1);
    expect(update.verifySuccessCount).toBe(0);
  });
});
