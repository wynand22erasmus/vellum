/**
 * Production email provider using AWS SES.
 *
 * @packageDocumentation
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
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
    await this.client.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [payload.to] },
        Message: {
          Subject: { Data: payload.subject },
          Body: { Text: { Data: payload.body } },
        },
        Source: 'noreply@vellum.app',
      }),
    );
  }
}
