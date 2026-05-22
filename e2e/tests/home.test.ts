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

  it('redirects home to login and shows branding (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    assert.equal(new URL(page.url()).pathname, '/login');

    const logo = await page.$('img[alt*="Vellum"]');
    assert.ok(logo, 'logo image should be visible');

    const title = await page.title();
    assert.match(title, /Secure document transfer/i);
    await page.close();
  });

  it('redirects unknown routes to login (positive)', async () => {
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/does-not-exist`, { waitUntil: 'networkidle0' });
    assert.equal(new URL(page.url()).pathname, '/login');
    const logo = await page.$('img[alt*="Vellum"]');
    assert.ok(logo);
    await page.close();
  });
});
