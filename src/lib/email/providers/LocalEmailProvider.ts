/**
 * Development email provider that delivers to Mailpit via SMTP.
 *
 * @packageDocumentation
 */

import nodemailer from 'nodemailer';
import type { EmailPayload, IEmailProvider } from '../IEmailProvider.ts';
import { env } from '../../env.ts';

/**
 * Sends mail through Mailpit (`MAILPIT_HOST` / `MAILPIT_PORT`).
 */
export class LocalEmailProvider implements IEmailProvider {
  private transporter = nodemailer.createTransport({
    host: env.mailpitHost,
    port: env.mailpitPort,
    secure: false,
  });

  /** @inheritdoc */
  async send(payload: EmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: payload.from ?? 'noreply@vellum.local',
      to: payload.to,
      subject: payload.subject,
      text: payload.body,
    });
  }
}
