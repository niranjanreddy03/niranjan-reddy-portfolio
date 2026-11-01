CREATE TABLE IF NOT EXISTS "CvDownloadCounter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO "CvDownloadCounter" ("id", "count") VALUES ('cv', 0);
