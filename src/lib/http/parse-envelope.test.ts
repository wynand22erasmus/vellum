/**
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import { buildResult } from './build-result.ts';
import { apiEnvelopeKind, isApiEnvelope } from './api-envelope.ts';
import { isProblemDetails, problemMessage } from './problem-details.ts';
import { parseApiEnvelope } from './parse-envelope.ts';
import { RESULT_CONTENT_TYPE } from './rfc9457.ts';
import { unwrapResult } from './vellum-result.ts';

function mockResponse(
  status: number,
  body: unknown,
  contentType = 'application/json',
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': contentType },
  });
}

describe('buildResult', () => {
  it('builds ok envelope with data payload', () => {
    const result = buildResult({ slug: 'ok', data: { id: '1' } });
    expect(result.type).toBe('https://vellum.dev/results/ok');
    expect(result.title).toBe('OK');
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ id: '1' });
  });

  it('builds created envelope with 201 status', () => {
    const result = buildResult({ slug: 'created', data: { id: '2' } });
    expect(result.status).toBe(201);
    expect(result.type).to.contain('/results/created');
  });
});

describe('apiEnvelopeKind', () => {
  it('classifies problem and result URIs', () => {
    expect(
      apiEnvelopeKind({
        type: 'https://vellum.dev/problems/not-found',
        title: 'Not Found',
        status: 404,
      }),
    ).toBe('problem');
    expect(
      apiEnvelopeKind({
        type: 'https://vellum.dev/results/ok',
        title: 'OK',
        status: 200,
      }),
    ).toBe('result');
  });
});

describe('parseApiEnvelope', () => {
  it('unwraps VellumResult success envelopes', async () => {
    const body = buildResult({ slug: 'ok', data: { status: 'ok', checks: { db: true } } });
    const res = mockResponse(200, body, RESULT_CONTENT_TYPE);
    const parsed = await parseApiEnvelope<{ status: string; checks: Record<string, boolean> }>(res);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.status).toBe('ok');
      expect(parsed.data.checks.db).toBe(true);
      expect(unwrapResult(parsed.result)).toEqual(parsed.data);
    }
  });

  it('parses Problem Details on failure', async () => {
    const body = {
      type: 'https://vellum.dev/problems/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Sign in required.',
    };
    const res = mockResponse(401, body, 'application/problem+json');
    const parsed = await parseApiEnvelope(res);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(isProblemDetails(parsed.problem)).toBe(true);
      expect(problemMessage(parsed.problem)).toBe('Sign in required.');
    }
  });

  it('rejects bare JSON on 2xx without a VellumResult envelope', async () => {
    const res = mockResponse(200, { documents: [] });
    const parsed = await parseApiEnvelope<{ documents: unknown[] }>(res);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.problem.detail).toContain('VellumResult');
    }
  });
});

describe('isApiEnvelope', () => {
  it('recognizes RFC 9457 documents', () => {
    expect(
      isApiEnvelope({
        type: 'https://vellum.dev/results/ok',
        title: 'OK',
        status: 200,
        data: null,
      }),
    ).toBe(true);
  });
});
