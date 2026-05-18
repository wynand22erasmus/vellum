/**
 * Email provider abstraction for download-link notifications.
 *
 * @packageDocumentation
 */

/** Plain-text email content passed to a provider implementation. */
export interface EmailPayload {
  /** Recipient address */
  to: string;
  /** Message subject line */
  subject: string;
  /** Plain-text body */
  body: string;
}

/**
 * Sends transactional email (implemented by Mailpit SMTP or AWS SES).
 */
export interface IEmailProvider {
  /**
   * Delivers one message.
   *
   * @param payload - Recipient, subject, and body
   */
  send(payload: EmailPayload): Promise<void>;
}
