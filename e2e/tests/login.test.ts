import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_URL, clearDevSession, launchBrowser, loadState, newPage } from '../helpers.ts';

describe('Dev login page', () => {
  let browser: Awaited<ReturnType<typeof launchBrowser>>;

  before(async () => {
    browser = await launchBrowser();
  });

  after(async () => {
    await browser.close();
  });

  it('submits valid email and reaches dashboard (positive)', async () => {
    const state = loadState();
    const page = await newPage(browser);
    await clearDevSession(page);
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await page.type('#email', state.recipientEmail);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]'),
    ]);
    assert.equal(new URL(page.url()).pathname, '/dashboard');
    await page.close();
  });

  it('blocks empty email via HTML validation (negative)', async () => {
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

    await page.click('button[type="submit"]');
    const isValid = await page.$eval(
      '#email',
      (el) => (el as HTMLInputElement).checkValidity(),
    );
    assert.equal(isValid, false, 'empty email should fail validation');
    assert.equal(new URL(page.url()).pathname, '/login');
    await page.close();
  });
});
