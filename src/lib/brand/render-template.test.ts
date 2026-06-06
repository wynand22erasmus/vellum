/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import { renderBrandTemplate } from './render-template.ts';

describe('renderBrandTemplate', () => {
  it('substitutes known placeholders', () => {
    const result = renderBrandTemplate('Hello {{displayName}} — {{fileName}}', {
      displayName: 'Acme',
      fileName: 'report.pdf',
    });
    expect(result).toBe('Hello Acme — report.pdf');
  });

  it('leaves unknown placeholders empty', () => {
    expect(renderBrandTemplate('{{missing}}', {})).toBe('');
  });

  it('renders download link template vars', () => {
    const preset = 'Visit {{verifyUrl}} for {{fileName}} from {{displayName}}';
    expect(
      renderBrandTemplate(preset, {
        verifyUrl: 'https://app.example/verify/abc',
        fileName: 'invoice.pdf',
        displayName: 'Vellum',
      }),
    ).toBe('Visit https://app.example/verify/abc for invoice.pdf from Vellum');
  });
});
