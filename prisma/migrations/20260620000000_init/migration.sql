-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserKind" AS ENUM ('ADMIN', 'CONSUMER');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('USER_LOGIN', 'EMAIL_INITIAL_SENT', 'EMAIL_REGENERATE_SENT', 'FILE_DOWNLOAD_SUCCESS', 'FILE_DOWNLOAD_FAILED', 'FILE_PURGED', 'LINK_REVOKED', 'CAPTCHA_FAILED', 'RECIPIENT_OTP_SENT', 'RECIPIENT_OTP_RESENT', 'RECIPIENT_OTP_FAILED', 'RECIPIENT_OTP_VERIFIED', 'SFTP_FILE_RECEIVED', 'SFTP_METADATA_VALIDATED', 'SFTP_VIRUS_SCAN_PASSED', 'SFTP_DOCUMENT_CREATED', 'SFTP_STORAGE_UPLOADED', 'SFTP_EMAIL_QUEUED', 'SFTP_INGESTION_COMPLETED', 'SFTP_INGESTION_FAILED');

-- CreateEnum
CREATE TYPE "DeadLetterPipeline" AS ENUM ('AUDIT', 'PROCESS_ERROR', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "RecipientOtpChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'AUTHENTICATOR');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "kind" "UserKind" NOT NULL DEFAULT 'CONSUMER',
    "firstName" TEXT,
    "lastName" TEXT,
    "profilePictureUrl" TEXT,
    "lastSignInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "File" (
    "fileId" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "s3Key" TEXT,
    "fileName" TEXT NOT NULL,
    "fileExpiresAt" TIMESTAMP(3) NOT NULL,
    "recordExpiresAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "byteSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "Recipient" (
    "recipientId" TEXT NOT NULL,
    "sourceSystemKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "otpChannel" "RecipientOtpChannel",
    "authenticatorSecretEnc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("recipientId")
);

-- CreateTable
CREATE TABLE "Document" (
    "documentId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "maxDownloads" INTEGER NOT NULL DEFAULT 1,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "verifySuccessCount" INTEGER NOT NULL DEFAULT 0,
    "lastVerifiedAt" TIMESTAMP(3),
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("documentId")
);

-- CreateTable
CREATE TABLE "Communication" (
    "communicationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "downloadToken" TEXT NOT NULL,
    "linkExpiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("communicationId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "auditLogId" TEXT NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "documentId" TEXT,
    "communicationId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "processErrorId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("auditLogId")
);

-- CreateTable
CREATE TABLE "DeadLetter" (
    "deadLetterId" TEXT NOT NULL,
    "pipeline" "DeadLetterPipeline" NOT NULL,
    "payload" JSONB NOT NULL,
    "error" TEXT NOT NULL,
    "retried" BOOLEAN NOT NULL DEFAULT false,
    "linkedTable" TEXT,
    "linkedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeadLetter_pkey" PRIMARY KEY ("deadLetterId")
);

-- CreateTable
CREATE TABLE "ProcessError" (
    "processErrorId" TEXT NOT NULL,
    "problemType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,
    "instance" TEXT,
    "requestId" TEXT,
    "source" TEXT NOT NULL,
    "userId" TEXT,
    "documentId" TEXT,
    "communicationId" TEXT,
    "deadLetterId" TEXT,
    "extensions" JSONB,
    "internal" JSONB,
    "reconciledAt" TIMESTAMP(3),
    "reconcileAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditLogId" TEXT,
    "correlationId" TEXT,

    CONSTRAINT "ProcessError_pkey" PRIMARY KEY ("processErrorId")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "webhookDeliveryId" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "auditLogId" TEXT NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "responseStatus" INTEGER,
    "responseBody" TEXT,
    "success" BOOLEAN NOT NULL,
    "attempt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("webhookDeliveryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "File_sha256_key" ON "File"("sha256");

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_sourceSystemKey_key" ON "Recipient"("sourceSystemKey");

-- CreateIndex
CREATE INDEX "Recipient_email_idx" ON "Recipient"("email");

-- CreateIndex
CREATE INDEX "Document_fileId_recipientId_idx" ON "Document"("fileId", "recipientId");

-- CreateIndex
CREATE INDEX "Document_batchId_idx" ON "Document"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "Communication_downloadToken_key" ON "Communication"("downloadToken");

-- CreateIndex
CREATE INDEX "Communication_documentId_idx" ON "Communication"("documentId");

-- CreateIndex
CREATE INDEX "AuditLog_processErrorId_idx" ON "AuditLog"("processErrorId");

-- CreateIndex
CREATE INDEX "AuditLog_documentId_idx" ON "AuditLog"("documentId");

-- CreateIndex
CREATE INDEX "AuditLog_communicationId_idx" ON "AuditLog"("communicationId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "DeadLetter_pipeline_idx" ON "DeadLetter"("pipeline");

-- CreateIndex
CREATE INDEX "DeadLetter_pipeline_createdAt_idx" ON "DeadLetter"("pipeline", "createdAt");

-- CreateIndex
CREATE INDEX "DeadLetter_retried_idx" ON "DeadLetter"("retried");

-- CreateIndex
CREATE INDEX "DeadLetter_linkedTable_linkedId_idx" ON "DeadLetter"("linkedTable", "linkedId");

-- CreateIndex
CREATE INDEX "ProcessError_deadLetterId_idx" ON "ProcessError"("deadLetterId");

-- CreateIndex
CREATE INDEX "ProcessError_auditLogId_idx" ON "ProcessError"("auditLogId");

-- CreateIndex
CREATE INDEX "ProcessError_correlationId_idx" ON "ProcessError"("correlationId");

-- CreateIndex
CREATE INDEX "ProcessError_documentId_idx" ON "ProcessError"("documentId");

-- CreateIndex
CREATE INDEX "ProcessError_communicationId_idx" ON "ProcessError"("communicationId");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookDelivery_deliveryId_key" ON "WebhookDelivery"("deliveryId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_auditLogId_idx" ON "WebhookDelivery"("auditLogId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_eventType_idx" ON "WebhookDelivery"("eventType");

-- CreateIndex
CREATE INDEX "WebhookDelivery_createdAt_idx" ON "WebhookDelivery"("createdAt");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("fileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("recipientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Communication" ADD CONSTRAINT "Communication_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("documentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("documentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_communicationId_fkey" FOREIGN KEY ("communicationId") REFERENCES "Communication"("communicationId") ON DELETE RESTRICT ON UPDATE CASCADE;
