/**
 * Creates a {@link Document} delivery envelope.
 *
 * @packageDocumentation
 */

import argon2 from 'argon2';
import type { Document, File as DbFile, Recipient } from '../../../generated/client.ts';
import type { CompensationStack } from '../compensation/compensation-stack.ts';
import { deleteDocumentIfExists } from '../compensation/document.ts';
import { env } from '../env.ts';
import { prisma } from '../prisma.ts';

export type CreateDocumentInput = {
  file: DbFile;
  recipient: Recipient;
  password: string;
  maxDownloads?: number;
  batchId?: string | null;
  stack: CompensationStack;
};

/** Creates a document envelope with hashed password. */
export async function createDocument(input: CreateDocumentInput): Promise<Document> {
  const passwordHash = await argon2.hash(input.password);
  const maxDownloads = input.maxDownloads ?? env.defaultMaxDownloads;

  const document = await prisma.document.create({
    data: {
      fileId: input.file.fileId,
      recipientId: input.recipient.recipientId,
      passwordHash,
      maxDownloads,
      batchId: input.batchId ?? null,
    },
  });

  input.stack.registerUndo(
    'delete document',
    () => deleteDocumentIfExists(document.documentId),
    () => ({ kind: 'document', documentId: document.documentId }),
  );

  return document;
}
