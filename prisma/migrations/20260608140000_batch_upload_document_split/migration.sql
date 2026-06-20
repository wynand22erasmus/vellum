-- Item 7: Split Document into DocumentFile + DocumentUserLink with sha256 dedup support.
-- Legacy rows: sha256 is a deterministic placeholder (md5-based) per old Document.id;
-- real content hashes apply to new uploads only.

-- CreateTable
CREATE TABLE "document_files" (
    "id" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "s3Key" TEXT,
    "fileName" TEXT NOT NULL,
    "fileExpiresAt" TIMESTAMP(3) NOT NULL,
    "recordExpiresAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "byteSize" INTEGER,

    CONSTRAINT "document_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_user_links" (
    "id" TEXT NOT NULL,
    "documentFileId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "downloadToken" TEXT NOT NULL,
    "linkExpiresAt" TIMESTAMP(3) NOT NULL,
    "maxDownloads" INTEGER NOT NULL DEFAULT 1,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "verifySuccessCount" INTEGER NOT NULL DEFAULT 0,
    "lastVerifiedAt" TIMESTAMP(3),
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "otpChannel" "RecipientOtpChannel",
    "recipientPhone" TEXT,
    "totpSecretEnc" TEXT,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_user_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_files_sha256_key" ON "document_files"("sha256");

-- CreateIndex
CREATE UNIQUE INDEX "document_user_links_downloadToken_key" ON "document_user_links"("downloadToken");

-- CreateIndex
CREATE INDEX "document_user_links_recipientEmail_idx" ON "document_user_links"("recipientEmail");

-- CreateIndex
CREATE INDEX "document_user_links_documentFileId_idx" ON "document_user_links"("documentFileId");

-- CreateIndex
CREATE INDEX "document_user_links_batchId_idx" ON "document_user_links"("batchId");

-- Migrate existing Document rows → one DocumentFile + one DocumentUserLink each (preserve link id).
INSERT INTO "document_files" (
    "id",
    "sha256",
    "s3Key",
    "fileName",
    "fileExpiresAt",
    "recordExpiresAt",
    "deletedAt",
    "createdAt",
    "byteSize"
)
SELECT
    gen_random_uuid()::text,
    md5('vellum-legacy:' || "id") || md5('vellum-legacy-2:' || "id"),
    "s3Key",
    "fileName",
    "fileExpiresAt",
    "recordExpiresAt",
    "deletedAt",
    "createdAt",
    NULL
FROM "Document";

INSERT INTO "document_user_links" (
    "id",
    "documentFileId",
    "recipientEmail",
    "passwordHash",
    "downloadToken",
    "linkExpiresAt",
    "maxDownloads",
    "downloadCount",
    "verifySuccessCount",
    "lastVerifiedAt",
    "isUsed",
    "revokedAt",
    "otpChannel",
    "recipientPhone",
    "totpSecretEnc",
    "batchId",
    "createdAt"
)
SELECT
    d."id",
    df."id",
    d."recipientEmail",
    d."passwordHash",
    d."downloadToken",
    d."linkExpiresAt",
    d."maxDownloads",
    d."downloadCount",
    d."verifySuccessCount",
    d."lastVerifiedAt",
    d."isUsed",
    d."revokedAt",
    d."otpChannel",
    d."recipientPhone",
    d."totpSecretEnc",
    NULL,
    d."createdAt"
FROM "Document" d
INNER JOIN "document_files" df
    ON df."sha256" = md5('vellum-legacy:' || d."id") || md5('vellum-legacy-2:' || d."id");

-- Repoint audit FK from Document to document_user_links (link ids unchanged).
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_documentId_fkey";

ALTER TABLE "document_user_links" ADD CONSTRAINT "document_user_links_documentFileId_fkey"
    FOREIGN KEY ("documentFileId") REFERENCES "document_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "document_user_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop legacy table
DROP TABLE "Document";
