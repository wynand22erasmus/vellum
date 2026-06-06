import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_URL, devLogin, launchBrowser, loadState, newPage } from '../helpers.ts';

describe('Theme and branding', () => {
  let browser: Awaited<ReturnType<typeof launchBrowser>>;

  before(async () => {
    browser = await launchBrowser();
  });

  after(async () => {
    await browser.close();
  });

  it('exposes favicon and logo assets (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const faviconHref = await page.$eval('link[rel="icon"]', (el) =>
      el.getAttribute('href'),
    );
    assert.ok(faviconHref?.includes('favicon'));

    const logo = await page.$('img[alt*="Vellum"], aside img[src*="favicon"]');
    assert.ok(logo);
    await page.close();
  });

  it('changes theme via signed-in user menu (positive)', async () => {
    const state = loadState();
    const page = await newPage(browser);
    await devLogin(page, state.recipientEmail);

    const before = await page.evaluate(() => localStorage.getItem('vellum-theme'));

    await page.waitForSelector('[data-sidebar="footer"] [data-sidebar="menu-button"]', {
      timeout: 5000,
    });
    await page.click('[data-sidebar="footer"] [data-sidebar="menu-button"]');
    await page.waitForSelector('[role="menuitemradio"]', { timeout: 5000 });

    const target =
      before === 'light' ? 'dark' : before === 'dark' ? 'system' : 'light';
    const options = await page.$$('[role="menuitemradio"]');
    for (const option of options) {
      const label = await page.evaluate((el) => el.textContent?.trim().toLowerCase() ?? '', option);
      if (label.startsWith(target)) {
        await option.click();
        break;
      }
    }

    await page.waitForFunction(
      (prev) => localStorage.getItem('vellum-theme') !== prev,
      { timeout: 5000 },
      before,
    );

    const after = await page.evaluate(() => localStorage.getItem('vellum-theme'));
    assert.notEqual(after, before);
    await page.close();
  });
});
