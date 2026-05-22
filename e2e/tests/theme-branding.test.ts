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

    const logo = await page.$('img[alt*="Vellum"], aside img[src*="favicon"]');
    assert.ok(logo);
    await page.close();
  });

  it('changes theme via guest footer menu (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const before = await page.evaluate(() => localStorage.getItem('vellum-theme'));

    const themeButtons = await page.$$('aside button');
    const themeBtn = await (async () => {
      for (const btn of themeButtons) {
        const text = await page.evaluate((el) => el.textContent?.trim() ?? '', btn);
        if (text === 'Theme') {
          return btn;
        }
      }
      return null;
    })();
    assert.ok(themeBtn, 'theme menu should exist in sidebar footer when logged out');

    await themeBtn.click();
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
