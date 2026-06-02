-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserKind" AS ENUM ('ADMIN', 'CONSUMER');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('USER_LOGIN', 'EMAIL_INITIAL_SENT', 'EMAIL_REGENERATE_SENT', 'FILE_DOWNLOAD_SUCCESS', 'FILE_DOWNLOAD_FAILED', 'FILE_SCRUBBED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "kind" "UserKind" NOT NULL DEFAULT 'CONSUMER',
    "firstName" TEXT,
    "lastName" TEXT,
    "profilePictureUrl" TEXT,
    "lastSignInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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
    "processErrorId" TEXT,
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
    "processErrorId" TEXT,

    CONSTRAINT "FailedAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessError" (
    "id" TEXT NOT NULL,
    "problemType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,
    "instance" TEXT,
    "requestId" TEXT,
    "source" TEXT NOT NULL,
    "userId" TEXT,
    "documentId" TEXT,
    "extensions" JSONB,
    "internal" JSONB,
    "reconciledAt" TIMESTAMP(3),
    "reconcileAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failedAuditLogId" TEXT,
    "auditLogId" TEXT,
    "correlationId" TEXT,

    CONSTRAINT "ProcessError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FailedProcessError" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "error" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retried" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FailedProcessError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Document_downloadToken_key" ON "Document"("downloadToken");

-- CreateIndex
CREATE INDEX "Document_recipientEmail_idx" ON "Document"("recipientEmail");

-- CreateIndex
CREATE INDEX "AuditLog_processErrorId_idx" ON "AuditLog"("processErrorId");

-- CreateIndex
CREATE INDEX "FailedAuditLog_processErrorId_idx" ON "FailedAuditLog"("processErrorId");

-- CreateIndex
CREATE INDEX "ProcessError_failedAuditLogId_idx" ON "ProcessError"("failedAuditLogId");

-- CreateIndex
CREATE INDEX "ProcessError_auditLogId_idx" ON "ProcessError"("auditLogId");

-- CreateIndex
CREATE INDEX "ProcessError_correlationId_idx" ON "ProcessError"("correlationId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
