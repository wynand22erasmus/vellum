/**
 * High-level email API for document download links.
 *
 * @packageDocumentation
 */

import { getBrandPresetFromEnv } from '../brand/get-brand-preset.ts';
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
    const subject = renderBrandTemplate(preset.email.subjects.emailVerification, {
      displayName: preset.displayName,
    });
    const body = renderBrandTemplate(preset.email.templates.emailVerification, {
      displayName: preset.displayName,
      verificationUrl,
    });
    await this.provider.send({
      to,
      subject,
      body,
      from: `${preset.email.fromName} <${preset.email.fromAddress}>`,
    });
  }

  async sendDownloadLink(to: string, token: string, fileName: string): Promise<void> {
    const preset = getBrandPresetFromEnv();
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
    await this.provider.send({
      to,
      subject,
      body,
      from: `${preset.email.fromName} <${preset.email.fromAddress}>`,
    });
  }
}
