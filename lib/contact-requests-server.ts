import { db } from "@/lib/database";

let schemaPromise: Promise<void> | undefined;

export function ensureContactRequestsTable() {
  schemaPromise ??= (async () => {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ContactRequest" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "ContactRequest_createdAt_idx" ON "ContactRequest"("createdAt")`;
  })().catch((error) => {
    schemaPromise = undefined;
    throw error;
  });
  return schemaPromise;
}
