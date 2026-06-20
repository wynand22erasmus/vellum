/**
 * Upload field validation shared by single and batch upload routes.
 *
 * @packageDocumentation
 */

import { z } from 'zod';
import { env } from '../env.ts';

export const recipientOtpChannelSchema = z.enum(['email', 'sms', 'whatsapp', 'authenticator']);

const otpFieldsRefinement = (
  data: { otpChannel?: z.infer<typeof recipientOtpChannelSchema>; recipientPhone?: string },
  ctx: z.RefinementCtx,
) => {
  if (!env.recipientOtpEnabled) {
    if (data.otpChannel || data.recipientPhone) {
      ctx.addIssue({
        code: 'custom',
        message: 'Recipient OTP is disabled; omit otpChannel and recipientPhone.',
        path: ['otpChannel'],
      });
    }
    return;
  }

  if (!data.otpChannel) {
    return;
  }

  if (
    (data.otpChannel === 'sms' || data.otpChannel === 'whatsapp') &&
    !data.recipientPhone
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'recipientPhone is required when otpChannel is sms or whatsapp.',
      path: ['recipientPhone'],
    });
  }
};

/** Single-recipient upload metadata (multipart body fields). */
export const uploadFieldsSchema = z
  .object({
    recipientEmail: z.string().email(),
    password: z.string().min(8),
    linkTtl: z.coerce.number().int().positive(),
    fileTtl: z.coerce.number().int().positive(),
    maxDownloads: z.coerce.number().int().min(1).max(100).optional(),
    otpChannel: recipientOtpChannelSchema.optional(),
    recipientPhone: z.string().min(8).max(20).optional(),
  })
  .refine((data) => data.linkTtl <= data.fileTtl, {
    message: 'linkTtl cannot exceed fileTtl',
  })
  .superRefine(otpFieldsRefinement);

/** One recipient entry in a batch upload JSON array. */
export const batchRecipientSchema = z
  .object({
    recipientEmail: z.string().email(),
    password: z.string().min(8),
    linkTtl: z.coerce.number().int().positive(),
    fileTtl: z.coerce.number().int().positive(),
    maxDownloads: z.coerce.number().int().min(1).max(100).optional(),
    otpChannel: recipientOtpChannelSchema.optional(),
    recipientPhone: z.string().min(8).max(20).optional(),
  })
  .refine((data) => data.linkTtl <= data.fileTtl, {
    message: 'linkTtl cannot exceed fileTtl',
  })
  .superRefine(otpFieldsRefinement);

export type BatchRecipientInput = z.infer<typeof batchRecipientSchema>;

/** Parses the batch `recipients` JSON field. */
export function parseBatchRecipients(raw: unknown): BatchRecipientInput[] {
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    parsed = JSON.parse(raw);
  }
  const result = z
    .array(batchRecipientSchema)
    .min(1)
    .max(env.maxBatchRecipients)
    .safeParse(parsed);
  return result.success ? result.data : [];
}

export { z as uploadZod };
