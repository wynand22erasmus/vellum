-- CreateEnum
CREATE TYPE "RecipientOtpChannel" AS ENUM ('email', 'sms', 'whatsapp', 'authenticator');

-- AlterEnum
ALTER TYPE "AuditEventType" ADD VALUE 'CAPTCHA_FAILED';
ALTER TYPE "AuditEventType" ADD VALUE 'RECIPIENT_OTP_SENT';
ALTER TYPE "AuditEventType" ADD VALUE 'RECIPIENT_OTP_RESENT';
ALTER TYPE "AuditEventType" ADD VALUE 'RECIPIENT_OTP_FAILED';
ALTER TYPE "AuditEventType" ADD VALUE 'RECIPIENT_OTP_VERIFIED';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN "otpChannel" "RecipientOtpChannel",
ADD COLUMN "recipientPhone" TEXT,
ADD COLUMN "totpSecretEnc" TEXT;
