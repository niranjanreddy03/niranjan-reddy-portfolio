import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const email = process.env.MONEYFLOW_ALLOWED_EMAIL?.trim().toLowerCase();
if (!process.env.DATABASE_URL || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("Set DATABASE_URL and MONEYFLOW_ALLOWED_EMAIL before provisioning MoneyFlow.");
}

const { PrismaClient } = await import("@prisma/client");
const db = new PrismaClient();
try {
  await db.user.upsert({ where: { email }, create: { email }, update: {} });
  console.log(`MoneyFlow account provisioned for ${email}. Google sign-in can now link it.`);
} finally {
  await db.$disconnect();
}
