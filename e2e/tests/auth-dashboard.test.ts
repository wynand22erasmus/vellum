import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_URL,
  clearDevSession,
  devLogin,
  launchBrowser,
  loadState,
  newPage,
} from '../helpers.ts';

describe('Dev login and dashboard', () => {
  let state: ReturnType<typeof loadState>;
  let browser: Awaited<ReturnType<typeof launchBrowser>>;

  before(async () => {
    state = loadState();
    browser = await launchBrowser();
  });

  after(async () => {
    await browser.close();
  });

  it('redirects unauthenticated users to login (negative)', async () => {
    const page = await newPage(browser);
    await clearDevSession(page);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(
      () => window.location.pathname === '/login',
      { timeout: 15_000 },
    );
    assert.equal(new URL(page.url()).pathname, '/login');
    await page.close();
  });

  it('logs in and lists seeded document (positive)', async () => {
    const page = await newPage(browser);
    await devLogin(page, state.recipientEmail);

    await page.waitForFunction(
      (fileName) => document.body.textContent?.includes(fileName) ?? false,
      { timeout: 15_000 },
      state.fileName,
    );

    const bodyText = await page.$eval('body', (el) => el.textContent ?? '');
    assert.match(bodyText, new RegExp(state.fileName));
    assert.match(bodyText, new RegExp(state.recipientEmail));

    await page.close();
  });

  it('requests a new access link from the dashboard (positive)', async () => {
    const page = await newPage(browser);
    await devLogin(page, state.recipientEmail);

    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((b) =>
        b.textContent?.includes('Send access link'),
      );
      btn?.click();
    });

    await page.waitForFunction(
      () => document.body.textContent?.match(/link|sent/i) != null,
      { timeout: 15_000 },
    );
    const bodyText = await page.$eval('body', (el) => el.textContent ?? '');
    assert.match(bodyText, /link|sent/i);
    await page.close();
  });

  it('signs out and returns to login (positive)', async () => {
    const page = await newPage(browser);
    await devLogin(page, state.recipientEmail);
    await page.click('[data-sidebar="footer"] [data-sidebar="menu-button"]');
    await page.waitForSelector('[role="menuitem"]', { timeout: 5000 });
    await page.evaluate(() => {
      const item = [...document.querySelectorAll('[role="menuitem"]')].find((el) =>
        el.textContent?.includes('Sign out'),
      );
      (item as HTMLElement | undefined)?.click();
    });
    await page.waitForFunction(
      () => window.location.pathname === '/login',
      { timeout: 15_000 },
    );
    assert.equal(new URL(page.url()).pathname, '/login');
    await page.close();
  });
});
