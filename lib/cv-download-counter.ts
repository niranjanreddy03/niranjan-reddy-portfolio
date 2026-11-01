import { db } from "@/lib/database";

let schemaPromise: Promise<void> | undefined;

export function ensureCvDownloadCounterTable() {
  schemaPromise ??= (async () => {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CvDownloadCounter" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "count" INTEGER NOT NULL DEFAULT 0
      )
    `;
    await db.$executeRaw`INSERT OR IGNORE INTO "CvDownloadCounter" ("id", "count") VALUES ('cv', 0)`;
  })().catch((error) => {
    schemaPromise = undefined;
    throw error;
  });
  return schemaPromise;
}

export async function incrementCvDownloadCount() {
  await ensureCvDownloadCounterTable();
  await db.$executeRaw`UPDATE "CvDownloadCounter" SET "count" = "count" + 1 WHERE "id" = 'cv'`;
}

export async function getCvDownloadCount() {
  await ensureCvDownloadCounterTable();
  const rows = await db.$queryRaw<Array<{ count: number }>>`
    SELECT "count" FROM "CvDownloadCounter" WHERE "id" = 'cv' LIMIT 1
  `;
  return Number(rows[0]?.count ?? 0);
}
