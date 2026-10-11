import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalPrisma = globalThis as unknown as { appPrisma?: PrismaClient };
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (Boolean(tursoUrl) !== Boolean(tursoToken)) throw new Error("Set both TURSO_DATABASE_URL and TURSO_AUTH_TOKEN");

export const db = globalPrisma.appPrisma ?? (tursoUrl && tursoToken
  ? new PrismaClient({ adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }) })
  : new PrismaClient());

if (process.env.NODE_ENV !== "production") globalPrisma.appPrisma = db;
