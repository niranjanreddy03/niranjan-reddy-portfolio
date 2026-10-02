ALTER TABLE "Subscription" ADD COLUMN "accountId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "nextDueAt" DATETIME;
ALTER TABLE "RecurringTransaction" ADD COLUMN "subscriptionId" TEXT;
