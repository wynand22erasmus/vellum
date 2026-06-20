/**
 * High-level email API for document download links.
 *
 * @packageDocumentation
 */

import { getEmailTheme } from '../brand/email-theme.ts';
import { getBrandPresetFromEnv } from '../brand/get-brand-preset.ts';
import {
  contentFromPlainText,
  renderBrandedHtmlEmail,
} from '../brand/render-html-email.ts';
import { renderBrandTemplate } from '../brand/render-template.ts';
import { env } from '../env.ts';
import type { IEmailProvider } from './IEmailProvider.ts';
import { LocalEmailProvider } from './providers/LocalEmailProvider.ts';
import { SesEmailProvider } from './providers/SesEmailProvider.ts';

/**
 * Sends recipient emails using the configured provider (`local` or `ses`).
 */
export class EmailService {
  private provider: IEmailProvider;

  /** Selects {@link LocalEmailProvider} or {@link SesEmailProvider} from `EMAIL_PROVIDER`. */
  constructor() {
    this.provider =
      env.emailProvider === 'ses' ? new SesEmailProvider() : new LocalEmailProvider();
  }

  /**
   * Sends a dashboard account email verification link (development / Mailpit).
   *
   * @param to - Recipient email
   * @param verificationUrl - Full URL to `GET /api/auth/verify-email`
   */
  async sendAccountEmailVerification(to: string, verificationUrl: string): Promise<void> {
    const preset = getBrandPresetFromEnv();
    const theme = getEmailTheme(preset, env.appUrl);
    const subject = renderBrandTemplate(preset.email.subjects.emailVerification, {
      displayName: preset.displayName,
    });
    const body = renderBrandTemplate(preset.email.templates.emailVerification, {
      displayName: preset.displayName,
      verificationUrl,
    });
    const html = renderBrandedHtmlEmail(
      preset,
      theme,
      contentFromPlainText(body, {
        ctaUrl: verificationUrl,
        ctaLabel: 'Verify email address',
      }),
    );
    await this.provider.send({
      to,
      subject,
      body,
      html,
      from: `${preset.email.fromName} <${preset.email.fromAddress}>`,
    });
  }

  async sendDownloadLink(to: string, token: string, fileName: string): Promise<void> {
    const preset = getBrandPresetFromEnv();
    const theme = getEmailTheme(preset, env.appUrl);
    const verifyUrl = `${env.appUrl}/verify/${token}`;
    const subject = renderBrandTemplate(preset.email.subjects.downloadLink, {
      displayName: preset.displayName,
      fileName,
    });
    const body = renderBrandTemplate(preset.email.templates.downloadLink, {
      displayName: preset.displayName,
      verifyUrl,
      fileName,
    });
    const html = renderBrandedHtmlEmail(
      preset,
      theme,
      contentFromPlainText(body, {
        ctaUrl: verifyUrl,
        ctaLabel: 'Download document',
        preheader: `Secure document ready: ${fileName}`,
      }),
    );
    await this.provider.send({
      to,
      subject,
      body,
      html,
      from: `${preset.email.fromName} <${preset.email.fromAddress}>`,
    });
  }

  /**
   * Sends a one-time download verification code to the recipient (second factor).
   */
  async sendRecipientOtp(
    to: string,
    code: string,
    fileName: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const preset = getBrandPresetFromEnv();
    const theme = getEmailTheme(preset, env.appUrl);
    const minutes = Math.max(1, Math.round(expiresInSeconds / 60));
    const subject = renderBrandTemplate(preset.email.subjects.recipientOtp, {
      displayName: preset.displayName,
      fileName,
    });
    const body = renderBrandTemplate(preset.email.templates.recipientOtp, {
      displayName: preset.displayName,
      fileName,
      code,
      expiresMinutes: String(minutes),
    });
    const html = renderBrandedHtmlEmail(
      preset,
      theme,
      contentFromPlainText(body, {
        headline: `Verification code for ${fileName}`,
        codeBlock: code,
        preheader: `Your verification code: ${code}`,
      }),
    );
    await this.provider.send({
      to,
      subject,
      body,
      html,
      from: `${preset.email.fromName} <${preset.email.fromAddress}>`,
    });
  }
}
