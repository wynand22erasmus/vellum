/**
 * Production email provider using AWS SES.
 *
 * @packageDocumentation
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getBrandPresetFromEnv } from '../../brand/get-brand-preset.ts';
import type { EmailPayload, IEmailProvider } from '../IEmailProvider.ts';

/**
 * Sends mail via AWS SES (`AWS_SES_REGION`, default `us-east-1`).
 */
export class SesEmailProvider implements IEmailProvider {
  private client = new SESClient({
    region: process.env.AWS_SES_REGION ?? 'us-east-1',
  });

  /** @inheritdoc */
  async send(payload: EmailPayload): Promise<void> {
    const preset = getBrandPresetFromEnv();
    const body: { Text: { Data: string }; Html?: { Data: string } } = {
      Text: { Data: payload.body },
    };
    if (payload.html) {
      body.Html = { Data: payload.html };
    }
    await this.client.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [payload.to] },
        Message: {
          Subject: { Data: payload.subject },
          Body: body,
        },
        Source: payload.from ?? `${preset.email.fromName} <${preset.email.fromAddress}>`,
      }),
    );
  }
}
