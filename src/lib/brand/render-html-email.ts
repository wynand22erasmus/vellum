/**
 * Branded HTML layout for transactional notification emails.
 *
 * @packageDocumentation
 */

import type { BrandPreset } from './presets.ts';
import type { EmailTheme } from './email-theme.ts';

/** Structured body passed into the shared HTML shell. */
export type BrandedEmailContent = {
  /** Short preview line (hidden in most clients). */
  preheader?: string;
  headline: string;
  bodyParagraphs: string[];
  cta?: { label: string; url: string };
  /** Large monospace code display (OTP). */
  codeBlock?: string;
  footerNote?: string;
};

/** Escape user-controlled strings for safe HTML insertion. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function paragraphHtml(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(text)}</p>`;
}

/**
 * Derive structured HTML content from a plain-text template body.
 * The first non-empty line becomes the headline; http(s) lines become the CTA URL.
 */
export function contentFromPlainText(
  plainBody: string,
  options: {
    headline?: string;
    ctaUrl?: string;
    ctaLabel?: string;
    codeBlock?: string;
    preheader?: string;
  } = {},
): BrandedEmailContent {
  const lines = plainBody
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const urlLine = lines.find((line) => /^https?:\/\//.test(line));
  const ctaUrl = options.ctaUrl ?? urlLine;
  const bodyLines = lines.filter((line) => line !== urlLine && !/^https?:\/\//.test(line));

  const headline = options.headline ?? bodyLines.shift() ?? 'Notification';
  const footerNote =
    bodyLines.length > 0 && bodyLines[bodyLines.length - 1]?.startsWith('—')
      ? bodyLines.pop()
      : undefined;

  // Drop the OTP code line from body paragraphs when rendering a code block separately.
  const bodyParagraphs = options.codeBlock
    ? bodyLines.filter((line) => !line.includes(options.codeBlock!))
    : bodyLines;

  return {
    preheader: options.preheader,
    headline,
    bodyParagraphs,
    cta: ctaUrl
      ? { label: options.ctaLabel ?? 'Open link', url: ctaUrl }
      : undefined,
    codeBlock: options.codeBlock,
    footerNote,
  };
}

/**
 * Render a complete branded HTML email document.
 */
export function renderBrandedHtmlEmail(
  preset: BrandPreset,
  theme: EmailTheme,
  content: BrandedEmailContent,
): string {
  const { headline, bodyParagraphs, cta, codeBlock, footerNote, preheader } = content;

  const paragraphs = bodyParagraphs.map(paragraphHtml).join('\n');

  const ctaHtml = cta
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
  <tr>
    <td style="border-radius:6px;background:${theme.primaryColor};">
      <a href="${escapeHtml(cta.url)}" target="_blank" rel="noopener noreferrer"
         style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
        ${escapeHtml(cta.label)}
      </a>
    </td>
  </tr>
</table>
<p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#6b7280;word-break:break-all;">
  ${escapeHtml(cta.url)}
</p>`
    : '';

  const codeHtml = codeBlock
    ? `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#374151;">Your verification code:</p>
<div style="margin:0 0 24px;padding:16px 24px;background:#f3f4f6;border-radius:8px;text-align:center;">
  <span style="font-family:ui-monospace,Consolas,monospace;font-size:28px;font-weight:700;letter-spacing:0.2em;color:#111827;">${escapeHtml(codeBlock)}</span>
</div>`
    : '';

  const footerNoteHtml = footerNote
    ? `<p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">${escapeHtml(footerNote.replace(/^—\s*/, ''))}</p>`
    : '';

  const preheaderHtml = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(headline)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:3px solid ${theme.primaryColor};">
              <img src="${escapeHtml(theme.logoUrl)}" alt="${escapeHtml(preset.displayName)}" width="180" style="max-width:180px;height:auto;display:inline-block;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 20px;font-size:22px;font-weight:600;line-height:1.3;color:#111827;">${escapeHtml(headline)}</h1>
              ${paragraphs}
              ${codeHtml}
              ${ctaHtml}
              ${footerNoteHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;line-height:1.6;color:#9ca3af;">
              ${theme.footerHtml}
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;">Sent by ${escapeHtml(preset.displayName)}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
