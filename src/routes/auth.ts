import { Router } from 'express';
import { logEvent } from '../queues/auditQueue.ts';
import { getAuthorizationUrl, getWorkOS } from '../lib/auth/workos.ts';
import { createSessionToken, verifySessionToken } from '../lib/auth/session.ts';
import { env } from '../lib/env.ts';

export const authRouter = Router();

authRouter.get('/login', (_req, res) => {
  if (env.authProvider !== 'workos') {
    res.status(400).json({
      error: 'WorkOS is not enabled. Use X-Dev-User-Email header for local development.',
    });
    return;
  }
  res.redirect(getAuthorizationUrl());
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
    const { user } = await workos.userManagement.authenticateWithCode({
      code,
      clientId: env.workosClientId()!,
    });

    logEvent({
      eventType: 'USER_LOGIN',
      userId: user.id,
      ip: req.ip,
      metadata: { email: user.email, provider: 'WorkOS' },
    });

    const token = await createSessionToken({ id: user.id, email: user.email });
    res.cookie('vellum_session', token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error('[Auth callback]', err);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('vellum_session', { path: '/' });
  res.json({ message: 'Logged out.' });
});

authRouter.get('/me', async (req, res) => {
  if (env.authProvider === 'workos') {
    const session = req.cookies?.vellum_session;
    if (!session) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }
    try {
      const user = await verifySessionToken(session);
      res.json({ user, provider: 'workos' });
    } catch {
      res.status(401).json({ error: 'Invalid session.' });
    }
    return;
  }

  const devEmail = req.headers['x-dev-user-email'];
  if (typeof devEmail === 'string' && devEmail.includes('@')) {
    res.json({ user: { id: `dev:${devEmail}`, email: devEmail }, provider: 'dev' });
    return;
  }

  res.status(401).json({ error: 'Not authenticated.' });
});
