import { env } from '../env.ts';
import type { IEmailProvider } from './IEmailProvider.ts';
import { LocalEmailProvider } from './providers/LocalEmailProvider.ts';
import { SesEmailProvider } from './providers/SesEmailProvider.ts';

export class EmailService {
  private provider: IEmailProvider;

  constructor() {
    this.provider =
      env.emailProvider === 'ses' ? new SesEmailProvider() : new LocalEmailProvider();
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
