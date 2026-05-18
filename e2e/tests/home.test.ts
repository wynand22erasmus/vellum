import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_URL, launchBrowser, newPage } from '../helpers.ts';

describe('Home page', () => {
  let browser: Awaited<ReturnType<typeof launchBrowser>>;

  before(async () => {
    browser = await launchBrowser();
  });

  after(async () => {
    await browser.close();
  });

  it('shows branding and navigates to login (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const logo = await page.$('img[alt*="Vellum"]');
    assert.ok(logo, 'logo image should be visible');

    const description = await page.$eval('body', (el) => el.textContent ?? '');
    assert.match(description, /Secure document transfer/i);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('a[href="/login"]'),
    ]);
    assert.equal(new URL(page.url()).pathname, '/login');
    await page.close();
  });

  it('redirects unknown routes to home (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/does-not-exist`, { waitUntil: 'networkidle0' });
    assert.equal(new URL(page.url()).pathname, '/');
    const logo = await page.$('img[alt*="Vellum"]');
    assert.ok(logo);
    await page.close();
  });
});
