import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_URL, launchBrowser, newPage } from '../helpers.ts';

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

    const logo = await page.$('img[alt*="Vellum"]');
    assert.ok(logo);
    await page.close();
  });

  it('cycles theme via toggle (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const toggle = await page.waitForSelector('aside button[aria-label]');
    assert.ok(toggle, 'theme toggle should exist in app shell');

    const before = await page.evaluate(() => ({
      dark: document.documentElement.classList.contains('dark'),
      scheme: document.documentElement.style.colorScheme,
      theme: localStorage.getItem('vellum-theme'),
    }));

    await toggle.click();
    await page.waitForFunction(
      (prev) => localStorage.getItem('vellum-theme') !== prev,
      { timeout: 5000 },
      before.theme,
    );

    const after = await page.evaluate(() => ({
      dark: document.documentElement.classList.contains('dark'),
      scheme: document.documentElement.style.colorScheme,
      theme: localStorage.getItem('vellum-theme'),
    }));

    assert.notEqual(after.theme, before.theme);
    assert.ok(after.scheme === 'dark' || after.scheme === 'light');
    await page.close();
  });
});
