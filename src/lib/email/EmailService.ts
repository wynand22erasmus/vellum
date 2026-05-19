/**
 * High-level email API for document download links.
 *
 * @packageDocumentation
 */

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
   * Emails the verify URL for a newly uploaded or regenerated document link.
   *
   * @param to - Recipient email
   * @param token - `downloadToken` for `/verify/{token}`
   * @param fileName - Display name included in the subject line
   */
  /**
   * Sends a dashboard account email verification link (development / Mailpit).
   *
   * @param to - Recipient email
   * @param verificationUrl - Full URL to `GET /api/auth/verify-email`
   */
  async sendAccountEmailVerification(to: string, verificationUrl: string): Promise<void> {
    await this.provider.send({
      to,
      subject: 'Verify your Vellum email address',
      body: `Please verify your email address before signing in to the Vellum dashboard.

Click the link below to confirm this address:

${verificationUrl}

This link expires in 24 hours. If you did not request this, you can ignore this message.`,
    });
  }

  async sendDownloadLink(to: string, token: string, fileName: string): Promise<void> {
    const url = `${env.appUrl}/verify/${token}`;
    await this.provider.send({
      to,
      subject: `Secure Document Ready: ${fileName}`,
      body: `Your document is ready for collection.

Visit the link below and enter your file password to download:

${url}

This link will expire as scheduled. Do not share this link.

If your download did not start, please log in to your Vellum dashboard to request a new link.`,
    });
  }
}
