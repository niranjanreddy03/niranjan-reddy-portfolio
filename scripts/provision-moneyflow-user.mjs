import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const email = process.env.MONEYFLOW_ALLOWED_EMAIL?.trim().toLowerCase();
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if ((!process.env.DATABASE_URL && !(tursoUrl && tursoToken)) || Boolean(tursoUrl) !== Boolean(tursoToken) || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("Set a local DATABASE_URL or both Turso credentials, and MONEYFLOW_ALLOWED_EMAIL, before provisioning MoneyFlow.");
}

const { PrismaClient } = await import("@prisma/client");
const db = tursoUrl && tursoToken
  ? new PrismaClient({ adapter: new (await import("@prisma/adapter-libsql")).PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }) })
  : new PrismaClient();
try {
  await db.user.upsert({ where: { email }, create: { email }, update: {} });
  console.log(`MoneyFlow account provisioned for ${email}. Google sign-in can now link it.`);
} finally {
  await db.$disconnect();
}
