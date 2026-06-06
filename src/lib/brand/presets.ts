/**
 * Build-time brand presets for SPA and transactional email.
 *
 * @packageDocumentation
 */

/** White-label configuration consumed by the SPA and EmailService. */
export type BrandPreset = {
  id: string;
  displayName: string;
  shortName: string;
  tagline: string;
  documentTitle: string;
  wordmark?: string;
  logos: {
    mark: string;
    full: string;
    favicon: string;
    appleTouchIcon?: string;
  };
  email: {
    fromName: string;
    fromAddress: string;
    subjects: {
      emailVerification: string;
      downloadLink: string;
    };
    templates: {
      emailVerification: string;
      downloadLink: string;
    };
  };
  /** Optional footer links on auth pages. */
  legal?: {
    termsUrl: string;
    privacyUrl: string;
  };
};

const vellumPreset: BrandPreset = {
  id: 'vellum',
  displayName: 'Vellum',
  shortName: 'Vellum',
  tagline: 'Secure document transfer',
  documentTitle: 'Vellum — Secure Document Transfer',
  wordmark: 'VELLUM',
  logos: {
    mark: '/brands/vellum/mark.png',
    full: '/brands/vellum/full.png',
    favicon: '/brands/vellum/favicon.png',
    appleTouchIcon: '/brands/vellum/apple-touch-icon.png',
  },
  email: {
    fromName: 'Vellum',
    fromAddress: 'noreply@vellum.app',
    subjects: {
      emailVerification: 'Verify your {{displayName}} email address',
      downloadLink: 'Secure Document Ready: {{fileName}}',
    },
    templates: {
      emailVerification: `Please verify your email address before signing in to the {{displayName}} dashboard.

Click the link below to confirm this address:

{{verificationUrl}}

This link expires in 24 hours. If you did not request this, you can ignore this message.`,
      downloadLink: `Your document is ready for collection.

Visit the link below and enter your file password to download:

{{verifyUrl}}

This link will expire as scheduled. Do not share this link.

If your download did not start, please log in to your {{displayName}} dashboard to request a new link.`,
    },
  },
  legal: {
    termsUrl: 'https://vellum.app/terms',
    privacyUrl: 'https://vellum.app/privacy',
  },
};

const clientExamplePreset: BrandPreset = {
  id: 'client-example',
  displayName: 'Acme Secure Transfer',
  shortName: 'Acme',
  tagline: 'Enterprise document delivery',
  documentTitle: 'Acme — Secure Document Transfer',
  wordmark: 'ACME',
  logos: {
    mark: '/brands/client-example/mark.png',
    full: '/brands/client-example/full.png',
    favicon: '/brands/client-example/favicon.png',
    appleTouchIcon: '/brands/client-example/apple-touch-icon.png',
  },
  email: {
    fromName: 'Acme Secure Transfer',
    fromAddress: 'noreply@acme.example.com',
    subjects: {
      emailVerification: 'Verify your {{displayName}} account',
      downloadLink: '{{displayName}} document ready: {{fileName}}',
    },
    templates: {
      emailVerification: `Welcome to {{displayName}}.

Verify your email to access the dashboard:

{{verificationUrl}}

This link expires in 24 hours.`,
      downloadLink: `A secure document is ready for you on {{displayName}}.

Open the link below and enter your file password:

{{verifyUrl}}

Do not share this link.`,
    },
  },
  legal: {
    termsUrl: 'https://acme.example.com/terms',
    privacyUrl: 'https://acme.example.com/privacy',
  },
};

/** All registered brand presets keyed by id. */
export const brandPresets: Record<string, BrandPreset> = {
  vellum: vellumPreset,
  'client-example': clientExamplePreset,
};

const DEFAULT_PRESET_ID = 'vellum';

/**
 * Resolve a brand preset by id, falling back to vellum.
 *
 * @param id - Preset id (optional)
 */
export function getBrandPreset(id?: string): BrandPreset {
  const key = id?.trim() || DEFAULT_PRESET_ID;
  return brandPresets[key] ?? brandPresets[DEFAULT_PRESET_ID]!;
}

/** Valid preset ids for env validation. */
export const BRAND_PRESET_IDS = Object.keys(brandPresets);
