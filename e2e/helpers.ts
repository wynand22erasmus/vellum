/**
 * Shared Puppeteer helpers and seeded state for browser E2E tests.
 *
 * @packageDocumentation
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, { type Browser, type Page } from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import 'dotenv/config';
import { buildPublicUrl } from '../src/lib/public-url.ts';

/** Base URL for UI tests (override with `E2E_BASE_URL`). */
export const BASE_URL = process.env.E2E_BASE_URL ?? buildPublicUrl();

/** Default Puppeteer timeout in milliseconds (`E2E_TIMEOUT_MS`). */
export const DEFAULT_TIMEOUT_MS = Number(process.env.E2E_TIMEOUT_MS ?? 30_000);

/**
 * Fixture data written by `npm run test:e2e:seed` and read by browser tests.
 */
export interface E2EState {
  baseUrl: string;
  apiKey: string;
  documentId: string;
  downloadToken: string;
  recipientEmail: string;
  password: string;
  fileName: string;
  seededAt: string;
}

/**
 * Loads `e2e/.state.json` produced by the seed script.
 *
 * @throws {Error} When the state file is missing
 */
export function loadState(): E2EState {
  const statePath = path.join(__dirname, '.state.json');
  if (!fs.existsSync(statePath)) {
    throw new Error(
      `Missing ${statePath}. Run: npm run test:e2e:seed (requires app + DB running)`,
    );
  }
  return JSON.parse(fs.readFileSync(statePath, 'utf8')) as E2EState;
}

/**
 * Launches a headless Chromium instance (set `E2E_HEADLESS=false` to debug).
 */
export async function launchBrowser(): Promise<Browser> {
  const configured = process.env.PUPPETEER_EXECUTABLE_PATH;
  const resolvedPath = configured
    ? configured
    : path.resolve(process.cwd(), puppeteer.executablePath());
  return puppeteer.launch({
    headless: process.env.E2E_HEADLESS !== 'false',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: resolvedPath,
  });
}

/**
 * Opens a new page with the default E2E timeout applied.
 *
 * @param browser - Browser from {@link launchBrowser}
 */
export async function newPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);
  return page;
}

/**
 * Signs in via the dev login form and waits for the dashboard route.
 *
 * @param page - Puppeteer page
 * @param email - Recipient email matching seeded document data
 */
export async function devLogin(page: Page, email: string): Promise<void> {
  await clearDevSession(page);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#email', { timeout: DEFAULT_TIMEOUT_MS });
  await page.type('#email', email);
  await page.click('form button[type="submit"]');
  await page.waitForFunction(
    () => window.location.pathname === '/dashboard',
    { timeout: DEFAULT_TIMEOUT_MS },
  );
}

/**
 * Clears the dev-auth email stored in `localStorage` (client-side mock session).
 *
 * @param page - Puppeteer page
 */
export async function clearDevSession(page: Page): Promise<void> {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    localStorage.removeItem('vellum_dev_email');
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  });
}
