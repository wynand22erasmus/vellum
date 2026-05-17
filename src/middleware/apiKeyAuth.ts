import type { Request, Response, NextFunction } from 'express';
import { env } from '../lib/env.ts';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header.' });
    return;
  }

  const token = authHeader.slice(7);
  if (token !== env.apiKey) {
    res.status(401).json({ error: 'Invalid API key.' });
    return;
  }

  next();
}
