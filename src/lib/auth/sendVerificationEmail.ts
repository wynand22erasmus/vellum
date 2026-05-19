/**
 * Sends account email verification messages (WorkOS or dev Mailpit).
 *
 * @packageDocumentation
 */

import { env } from '../env.ts';
import { EmailService } from '../email/EmailService.ts';
import { getWorkOS } from './workos.ts';
import { createEmailVerificationToken } from './emailVerification.ts';

/**
 * Asks WorkOS to email a verification code/link to the user.
 *
 * @param userId - WorkOS user id stored in `users.id`
 */
export async function sendWorkOSVerificationEmail(userId: string): Promise<void> {
  const workos = getWorkOS();
  await workos.userManagement.sendVerificationEmail({ userId });
}

/**
 * Emails a signed verification link for dev-auth users (Mailpit in local stacks).
 *
 * @param userId - `dev:{email}` user id
 * @param email - Normalized recipient address
 */
export async function sendDevVerificationEmail(userId: string, email: string): Promise<void> {
  const token = await createEmailVerificationToken(userId, email);
  const url = `${env.appUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const emailService = new EmailService();
  await emailService.sendAccountEmailVerification(email, url);
}
