/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import { getEmailTheme } from './email-theme.ts';
import { getBrandPreset } from './presets.ts';
import {
  contentFromPlainText,
  escapeHtml,
  renderBrandedHtmlEmail,
} from './render-html-email.ts';
import { renderBrandTemplate } from './render-template.ts';

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>"\'&</script>')).toBe(
      '&lt;script&gt;&quot;&#39;&amp;&lt;/script&gt;',
    );
  });
});

describe('contentFromPlainText', () => {
  it('derives headline and CTA from plain body', () => {
    const content = contentFromPlainText(
      'Your document is ready.\n\nVisit:\n\nhttps://example.com/verify/abc\n\nDo not share.',
      { ctaLabel: 'Download' },
    );
    expect(content.headline).toBe('Your document is ready.');
    expect(content.bodyParagraphs).toEqual(['Visit:', 'Do not share.']);
    expect(content.cta).toEqual({ label: 'Download', url: 'https://example.com/verify/abc' });
  });

  it('filters OTP code line when codeBlock is set', () => {
    const content = contentFromPlainText(
      'Your verification code for "file.pdf" is: 123456\n\nExpires soon.',
      { codeBlock: '123456' },
    );
    expect(content.bodyParagraphs).toEqual(['Expires soon.']);
    expect(content.codeBlock).toBe('123456');
  });
});

describe('renderBrandedHtmlEmail', () => {
  it('renders vellum download link HTML snapshot', () => {
    const preset = getBrandPreset('vellum');
    const theme = getEmailTheme(preset, 'https://vellum.example.com');
    const body = renderBrandTemplate(preset.email.templates.downloadLink, {
      displayName: preset.displayName,
      verifyUrl: 'https://vellum.example.com/verify/token-abc',
      fileName: 'contract.pdf',
    });
    const html = renderBrandedHtmlEmail(
      preset,
      theme,
      contentFromPlainText(body, {
        ctaUrl: 'https://vellum.example.com/verify/token-abc',
        ctaLabel: 'Download document',
        preheader: 'Secure document ready: contract.pdf',
      }),
    );

    expect(html).toMatchSnapshot();
    expect(html).toContain('Download document');
    expect(html).toContain('https://vellum.example.com/verify/token-abc');
    expect(html).toContain('#2B6CB0');
    expect(html).toContain('contract.pdf');
    expect(html).not.toContain('<script');
  });

  it('uses env overrides for theme', () => {
    const originalLogo = process.env.BRAND_LOGO_URL;
    const originalColor = process.env.BRAND_PRIMARY_COLOR;
    process.env.BRAND_LOGO_URL = 'https://cdn.example.com/logo.png';
    process.env.BRAND_PRIMARY_COLOR = '#ff0000';

    try {
      const preset = getBrandPreset('client-example');
      const theme = getEmailTheme(preset, 'https://acme.example.com');
      const html = renderBrandedHtmlEmail(preset, theme, {
        headline: 'Test',
        bodyParagraphs: ['Hello'],
      });
      expect(html).toContain('https://cdn.example.com/logo.png');
      expect(html).toContain('#ff0000');
    } finally {
      process.env.BRAND_LOGO_URL = originalLogo;
      process.env.BRAND_PRIMARY_COLOR = originalColor;
    }
  });
});
