import nodemailer from 'nodemailer';
import type { EmailPayload, IEmailProvider } from '../IEmailProvider.ts';
import { env } from '../../env.ts';

export class LocalEmailProvider implements IEmailProvider {
  private transporter = nodemailer.createTransport({
    host: env.mailpitHost,
    port: env.mailpitPort,
    secure: false,
  });

  async send(payload: EmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: 'noreply@vellum.local',
      to: payload.to,
      subject: payload.subject,
      text: payload.body,
    });
  }
}
