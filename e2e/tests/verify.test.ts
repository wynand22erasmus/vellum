import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { launchBrowser, loadState, newPage } from '../helpers.ts';

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
    await page.goto(`${state.baseUrl}/verify/${state.downloadToken}`, {
      waitUntil: 'networkidle0',
    });

    const heading = await page.$eval('body', (el) => el.textContent ?? '');
    assert.match(heading, /Secure Document Download/i);

    const passwordInput = await page.$('#password');
    assert.ok(passwordInput);
    await page.close();
  });

  it('accepts correct password and returns download URL (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(`${state.baseUrl}/verify/${state.downloadToken}`, {
      waitUntil: 'networkidle0',
    });

    const result = await page.evaluate(
      async ({ baseUrl, token, password }) => {
        const res = await fetch(`${baseUrl}/api/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        });
        return { status: res.status, body: await res.json() };
      },
      {
        baseUrl: state.baseUrl,
        token: state.downloadToken,
        password: state.password,
      },
    );

    assert.equal(result.status, 200);
    assert.ok((result.body as { downloadUrl?: string }).downloadUrl?.length);
    await page.close();
  });

  it('shows error for wrong password (negative)', async () => {
    const page = await newPage(browser);
    await page.goto(`${state.baseUrl}/verify/${state.downloadToken}`, {
      waitUntil: 'networkidle0',
    });

    await page.type('#password', 'definitely-wrong-password');
    await page.click('button[type="submit"]');

    await page.waitForSelector('[role="alert"]', { timeout: 10_000 });
    const alertText = await page.$eval('[role="alert"]', (el) => el.textContent ?? '');
    assert.match(alertText, /password|failed|invalid|attempts/i);
    await page.close();
  });
});
