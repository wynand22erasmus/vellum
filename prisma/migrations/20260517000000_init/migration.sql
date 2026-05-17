-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('USER_LOGIN', 'EMAIL_INITIAL_SENT', 'EMAIL_REGENERATE_SENT', 'FILE_DOWNLOAD_SUCCESS', 'FILE_DOWNLOAD_FAILED', 'FILE_SCRUBBED');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "s3Key" TEXT,
    "fileName" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "downloadToken" TEXT NOT NULL,
    "linkExpiresAt" TIMESTAMP(3) NOT NULL,
    "fileExpiresAt" TIMESTAMP(3) NOT NULL,
    "recordExpiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "documentId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FailedAuditLog" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "error" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retried" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FailedAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_downloadToken_key" ON "Document"("downloadToken");

-- CreateIndex
CREATE INDEX "Document_recipientEmail_idx" ON "Document"("recipientEmail");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
