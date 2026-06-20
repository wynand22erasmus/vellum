/**
 * Resolves transactional email branding from preset defaults and env overrides.
 *
 * @packageDocumentation
 */

import type { BrandPreset } from './presets.ts';

/** Visual and legal settings applied to HTML notification emails. */
export type EmailTheme = {
  logoUrl: string;
  primaryColor: string;
  footerHtml: string;
  supportEmail?: string;
};

function defaultFooterHtml(preset: BrandPreset): string {
  const parts: string[] = [`&copy; ${new Date().getFullYear()} ${preset.displayName}`];
  if (preset.legal?.termsUrl && preset.legal?.privacyUrl) {
    parts.push(
      `<a href="${preset.legal.termsUrl}" style="color:inherit;">Terms</a> &middot; <a href="${preset.legal.privacyUrl}" style="color:inherit;">Privacy</a>`,
    );
  }
  return parts.join(' &middot; ');
}

/**
 * Merge {@link BrandPreset} email defaults with optional `BRAND_*` env overrides.
 *
 * @param preset - Active brand preset
 * @param appUrl - Public app base URL (for relative logo paths)
 */
export function getEmailTheme(preset: BrandPreset, appUrl: string): EmailTheme {
  const baseUrl = appUrl.replace(/\/$/, '');
  const logoFromEnv = process.env.BRAND_LOGO_URL?.trim();
  const logoFromPreset = preset.email.logoUrl?.trim();
  const logoFromAssets = `${baseUrl}${preset.logos.full}`;

  const supportEmail =
    process.env.BRAND_SUPPORT_EMAIL?.trim() || preset.email.supportEmail?.trim() || undefined;

  let footerHtml =
    process.env.BRAND_FOOTER_HTML?.trim() || preset.email.footerHtml?.trim() || defaultFooterHtml(preset);

  if (supportEmail && !footerHtml.includes(supportEmail)) {
    footerHtml = `${footerHtml}<br/>Questions? Contact <a href="mailto:${supportEmail}" style="color:inherit;">${supportEmail}</a>`;
  }

  return {
    logoUrl: logoFromEnv || logoFromPreset || logoFromAssets,
    primaryColor:
      process.env.BRAND_PRIMARY_COLOR?.trim() || preset.email.primaryColor || '#2563eb',
    footerHtml,
    supportEmail,
  };
}
