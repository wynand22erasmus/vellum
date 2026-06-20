/**
 * Public metadata for the SPA (dev service links, environment flags).
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { getDevServices } from '../../lib/dev-services.ts';
import { env } from '../../lib/env.ts';
import { ok } from './http-helpers.ts';

/** Express router mounted at `/api`. */
export const metaRouter = Router();

/**
 * `GET /api/meta` — environment flags and dev service URLs for the UI menu.
 */
metaRouter.get('/meta', (req, res) => {
  ok(req, res, {
    isProduction: env.isProduction,
    devServices: getDevServices(),
    captcha: {
      provider: env.captchaProvider,
      siteKey:
        env.captchaProvider === 'hcaptcha' ? (env.hcaptchaSiteKey() ?? null) : null,
      required: env.captchaProvider === 'hcaptcha' && !env.skipCaptcha,
    },
    recipientOtpEnabled: env.recipientOtpEnabled,
  });
});
