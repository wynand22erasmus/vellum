-- AlterEnum
ALTER TYPE "AuditEventType" ADD VALUE 'LINK_REVOKED';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "maxDownloads" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Document" ADD COLUMN     "downloadCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Document" ADD COLUMN     "verifySuccessCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Document" ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3);
ALTER TABLE "Document" ADD COLUMN     "revokedAt" TIMESTAMP(3);
