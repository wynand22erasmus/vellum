/**
 * Unit tests assert production-safe defaults for these flags.
 * Unset them so a developer `.env` / shell (e.g. docker-compose E2E skips)
 * cannot make `npm test` diverge from GitHub CI.
 */
delete process.env.SKIP_VIRUS_SCAN;
delete process.env.SKIP_EMAIL_VERIFICATION;
delete process.env.SKIP_CAPTCHA;
