/**
 * Dashboard authentication routes (WorkOS OAuth and dev session probe).
 *
 * @packageDocumentation
 * @remarks
 * - `GET /api/auth/login` — redirect to WorkOS AuthKit
 * - `GET /api/auth/callback` — OAuth callback; requires verified email before session
 * - `GET /api/auth/verify-email` — dev verification link from Mailpit
 * - `POST /api/auth/dev/request-login` — dev: email verification or immediate access if verified
 * - `POST /api/auth/resend-verification` — resend WorkOS or dev verification email
 * - `POST /api/auth/logout` — clears session cookie
 * - `GET /api/auth/me` — current user or `{ user: null }` (`vellum_session` cookie; dev also accepts `X-Dev-User-Email`)
 */

import { Router } from 'express';
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

authRouter.get('/login', (req, res) => {
  if (env.authProvider !== 'workos') {
    res.status(400).json({
      error: 'WorkOS is not enabled. Use X-Dev-User-Email header for local development.',
    });
    return;
  }
  const returnTo =
    typeof req.query.returnTo === 'string' ? safeReturnTo(req.query.returnTo) : undefined;
  res.redirect(getAuthorizationUrl(returnTo));
});

authRouter.get('/callback', async (req, res) => {
  if (env.authProvider !== 'workos') {
    res.status(400).json({ error: 'WorkOS is not enabled.' });
    return;
  }

  const code = req.query.code;
  if (typeof code !== 'string') {
    res.status(400).json({ error: 'Missing authorization code.' });
    return;
  }

  try {
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
  } catch (err) {
    console.error('[Auth callback]', err);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

/**
 * Dev-only verification link from Mailpit (`GET /api/auth/verify-email?token=…`).
 * WorkOS users verify through WorkOS email, then sign in again via OAuth.
 */
authRouter.get('/verify-email', async (req, res) => {
  const token = req.query.token;
  if (typeof token !== 'string') {
    res.status(400).type('text/plain').send('Missing verification token.');
    return;
  }

  try {
    const { userId } = await verifyEmailVerificationToken(token);
    await markEmailVerified(userId);
    res.redirect('/login?verified=1');
  } catch (err) {
    console.error('[Auth verify-email]', err);
    res.status(400).type('text/plain').send('Invalid or expired verification link.');
  }
});

/**
 * Starts dev sign-in: sends a verification email when needed, or reports the user may proceed.
 */
authRouter.post('/dev/request-login', async (req, res) => {
  if (env.authProvider === 'workos') {
    res.status(400).json({ error: 'Dev login is not available when AUTH_PROVIDER=workos.' });
    return;
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (!email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }

  try {
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
  } catch (err) {
    console.error('[Auth dev/request-login]', err);
    res.status(500).json({ error: 'Could not start sign-in.' });
  }
});

/** Resends a verification email for the user identified by a `pending` handoff token. */
authRouter.post('/resend-verification', async (req, res) => {
  const pending = typeof req.body?.pending === 'string' ? req.body.pending : '';
  if (!pending) {
    res.status(400).json({ error: 'Missing pending verification token.' });
    return;
  }

  try {
    const { userId, email } = await verifyPendingVerificationToken(pending);

    if (env.authProvider === 'workos') {
      await sendWorkOSVerificationEmail(userId);
    } else {
      await sendDevVerificationEmail(userId, email);
    }

    res.json({ message: 'Verification email sent.' });
  } catch (err) {
    console.error('[Auth resend-verification]', err);
    res.status(400).json({ error: 'Invalid or expired verification request.' });
  }
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('vellum_session', { path: '/' });
  res.json({ message: 'Logged out.' });
});

authRouter.get('/me', async (req, res) => {
  const user = await resolveRequestUser(req);
  if (!user) {
    res.json({ user: null, provider: env.authProvider });
    return;
  }
  res.json({ user, provider: env.authProvider });
});
