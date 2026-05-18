import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_URL, launchBrowser, newPage } from '../helpers.ts';

describe('Health API (browser)', () => {
  let browser: Awaited<ReturnType<typeof launchBrowser>>;

  before(async () => {
    browser = await launchBrowser();
  });

  after(async () => {
    await browser.close();
  });

  it('reports ok from the running stack (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    const health = await page.evaluate(async (base) => {
      const res = await fetch(`${base}/api/health`);
      return { status: res.status, body: await res.json() };
    }, BASE_URL);

    assert.equal(health.status, 200);
    assert.equal(health.body.status, 'ok');
    assert.equal(health.body.checks.database, true);
    assert.equal(health.body.checks.redis, true);
    assert.equal(health.body.checks.clamav, true);
    await page.close();
  });
});
