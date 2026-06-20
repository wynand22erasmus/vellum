import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_URL, launchBrowser, loadState, newPage } from '../helpers.ts';

describe('Verify page', () => {
  let state: ReturnType<typeof loadState>;
  let browser: Awaited<ReturnType<typeof launchBrowser>>;

  before(async () => {
    state = loadState();
    browser = await launchBrowser();
  });

  after(async () => {
    await browser.close();
  });

  it('renders download form for valid token (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/verify/${state.downloadToken}`, {
      waitUntil: 'networkidle0',
    });

    const heading = await page.$eval('body', (el) => el.textContent ?? '');
    assert.match(heading, /Secure Document Download/i);

    const passwordInput = await page.$('#password');
    assert.ok(passwordInput);
    await page.close();
  });

  it('shows error for wrong password (negative)', async () => {
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/verify/${state.downloadToken}`, {
      waitUntil: 'networkidle0',
    });

    await page.waitForSelector('#password', { timeout: 10_000 });
    await page.type('#password', 'definitely-wrong-password');
    await page.click('form button[type="submit"]');

    await page.waitForSelector('[role="alert"]', { timeout: 10_000 });
    const alertText = await page.$eval('[role="alert"]', (el) => el.textContent ?? '');
    assert.match(alertText, /password|failed|invalid|attempts/i);
    await page.close();
  });

  it('navigates to complete page after correct password (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/verify/${state.downloadToken}`, {
      waitUntil: 'networkidle0',
    });

    await page.waitForSelector('#password', { timeout: 10_000 });
    await page.type('#password', state.password);
    await page.click('form button[type="submit"]');

    await page.waitForSelector('[data-testid="verify-complete"]', { timeout: 15_000 });
    await page.waitForSelector('[data-testid="file-sha256-display"]', { timeout: 5_000 });

    const body = await page.$eval('body', (el) => el.textContent ?? '');
    assert.match(body, /Download complete/i);
    assert.match(body, /SHA-256 checksum/i);
    assert.match(body, /sha256sum/i);
    await page.close();
  });
});
