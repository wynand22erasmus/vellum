/**
 * Dashboard authentication routes (WorkOS OAuth and dev session probe).
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../lib/errors/app-error.ts';
import { logEvent } from '../queues/auditQueue.ts';
import { getAuthorizationUrl, getWorkOS } from '../lib/auth/workos.ts';
import { safeReturnTo } from '../lib/auth/returnTo.ts';
import { createSessionToken, setSessionCookie } from '../lib/auth/session.ts';
import { resolveRequestUser } from '../lib/auth/resolveUser.ts';
import {
  assertEmailVerified,
  createPendingVerificationToken,
  isEmailVerificationSatisfied,
  verifyEmailVerificationToken,
  verifyPendingVerificationToken,
} from '../lib/auth/emailVerification.ts';
import { sendDevVerificationEmail, sendWorkOSVerificationEmail } from '../lib/auth/sendVerificationEmail.ts';
import { upsertWorkOSUser, markEmailVerified, upsertDevUser } from '../lib/users/userService.ts';
import { env } from '../lib/env.ts';

/** Express router mounted at `/api/auth`. */
export const authRouter = Router();

authRouter.get('/login', (req, res, next) => {
  try {
    if (env.authProvider !== 'workos') {
      throw AppError.badRequest(
        'WorkOS sign-in is not enabled in this environment. Set AUTH_PROVIDER=workos or use dev login with X-Dev-User-Email for local development.',
      );
    }
    const returnTo =
      typeof req.query.returnTo === 'string' ? safeReturnTo(req.query.returnTo) : undefined;
    res.redirect(getAuthorizationUrl(returnTo));
  } catch (err) {
    next(err);
  }
});

authRouter.get(
  '/callback',
  asyncHandler(async (req, res) => {
    if (env.authProvider !== 'workos') {
      throw AppError.badRequest(
        'WorkOS OAuth callback is not available when AUTH_PROVIDER is not set to workos.',
      );
    }

    const code = req.query.code;
    if (typeof code !== 'string') {
      throw AppError.badRequest(
        'WorkOS OAuth callback is missing the authorization code query parameter.',
      );
    }

    const workos = getWorkOS();
    const { user: workosUser } = await workos.userManagement.authenticateWithCode({
      code,
      clientId: env.workosClientId()!,
    });

    const user = await upsertWorkOSUser(workosUser);

    if (!isEmailVerificationSatisfied(user)) {
      await sendWorkOSVerificationEmail(user.id);
      const pending = await createPendingVerificationToken(user.id, user.email);
      res.redirect(`/login/email-verification?pending=${encodeURIComponent(pending)}`);
      return;
    }

    assertEmailVerified(user);

    logEvent({
      eventType: 'USER_LOGIN',
      userId: user.id,
      ip: req.ip,
      metadata: { email: user.email, provider: 'WorkOS', kind: user.kind },
    });

    const token = await createSessionToken({ id: user.id, email: user.email });
    setSessionCookie(res, token);

    const returnTo =
      typeof req.query.state === 'string' ? safeReturnTo(req.query.state) : '/dashboard';
    res.redirect(returnTo);
  }),
);

authRouter.get(
  '/verify-email',
  asyncHandler(async (req, res) => {
    const token = req.query.token;
    if (typeof token !== 'string') {
      res.status(400).type('text/plain').send('Missing verification token.');
      return;
    }

    const { userId } = await verifyEmailVerificationToken(token);
    await markEmailVerified(userId);
    res.redirect('/login?verified=1');
  }),
);

authRouter.post(
  '/dev/request-login',
  asyncHandler(async (req, res) => {
    if (env.authProvider === 'workos') {
      throw AppError.badRequest(
        'Dev email login is disabled when AUTH_PROVIDER=workos. Use WorkOS sign-in instead.',
      );
    }

    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    if (!email.includes('@')) {
      throw AppError.badRequest(
        'Request body must include a valid email address (field "email").',
      );
    }

    const user = await upsertDevUser(email);

    if (isEmailVerificationSatisfied(user)) {
      const token = await createSessionToken({ id: user.id, email: user.email });
      setSessionCookie(res, token);
      logEvent({
        eventType: 'USER_LOGIN',
        userId: user.id,
        ip: req.ip,
        metadata: { email: user.email, provider: 'dev', kind: user.kind },
      });
      res.json({ verified: true, email: user.email });
      return;
    }

    await sendDevVerificationEmail(user.id, user.email);
    const pending = await createPendingVerificationToken(user.id, user.email);
    res.json({
      verified: false,
      email: user.email,
      pending,
      message: 'Verification email sent. Check your inbox before continuing.',
    });
  }),
);

authRouter.post(
  '/resend-verification',
  asyncHandler(async (req, res) => {
    const pending = typeof req.body?.pending === 'string' ? req.body.pending : '';
    if (!pending) {
      throw AppError.badRequest(
        'Request body must include the pending verification token from the email verification page (field "pending").',
      );
    }

    const { userId, email } = await verifyPendingVerificationToken(pending).catch((err) => {
      if (err instanceof AppError) {
        throw err;
      }
      throw AppError.badRequest(
        'The pending verification token is invalid or has expired. Sign in again to request a new verification email.',
      );
    });

    if (env.authProvider === 'workos') {
      await sendWorkOSVerificationEmail(userId);
    } else {
      await sendDevVerificationEmail(userId, email);
    }

    res.json({ message: 'Verification email sent.' });
  }),
);

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('vellum_session', { path: '/' });
  res.json({ message: 'Logged out.' });
});

authRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const user = await resolveRequestUser(req);
    if (!user) {
      res.json({ user: null, provider: env.authProvider });
      return;
    }
    res.json({ user, provider: env.authProvider });
  }),
);
