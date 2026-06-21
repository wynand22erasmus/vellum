/**
 * AES-256-GCM encryption for TOTP secrets stored on Recipient rows.
 *
 * @packageDocumentation
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { env } from '../env.ts';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function deriveKey(): Buffer {
  return createHash('sha256').update(env.totpEncryptionKey()).digest();
}

/**
 * Encrypts a plaintext TOTP secret for storage in `Recipient.authenticatorSecretEnc`.
 */
export function encryptTotpSecret(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, deriveKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
}

/**
 * Decrypts a stored TOTP secret.
 */
export function decryptTotpSecret(ciphertext: string): string {
  const [ivB64, tagB64, dataB64] = ciphertext.split('.');
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Invalid encrypted TOTP secret format.');
  }
  const decipher = createDecipheriv(ALGORITHM, deriveKey(), Buffer.from(ivB64, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}
