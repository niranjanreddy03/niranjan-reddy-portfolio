import { db } from "@/lib/moneyflow-server";
import { dueSubscriptionRenewals } from "@/lib/moneyflow-subscription-schedule";

const atNoonUtc = (day: string) => new Date(`${day}T12:00:00Z`);

export async function settleDueSubscriptions(userId: string, todayKey: string) {
  await db.$transaction(async (tx) => {
    const subscriptions = await tx.subscription.findMany({
      where: { userId, status: "Active", accountId: { not: null }, nextDueAt: { lte: atNoonUtc(todayKey) } },
    });
    if (!subscriptions.length) return;

    let changed = false;
    const category = await tx.category.upsert({ where: { userId_name: { userId, name: "Entertainment" } }, update: {}, create: { userId, name: "Entertainment" } });
    const payment = await tx.paymentMethod.upsert({ where: { userId_name: { userId, name: "Scheduled" } }, update: {}, create: { userId, name: "Scheduled" } });

    for (const subscription of subscriptions) {
      if (!subscription.accountId || !subscription.nextDueAt) continue;
      const account = await tx.account.findFirst({ where: { id: subscription.accountId, userId }, select: { id: true, kind: true } });
      if (!account) continue;
      const { dates, nextDue } = dueSubscriptionRenewals(subscription.nextDueAt.toISOString().slice(0, 10), subscription.dueDay, todayKey);
      if (!dates.length) continue;
      const merchant = await tx.merchant.upsert({ where: { userId_name: { userId, name: subscription.name } }, update: {}, create: { userId, name: subscription.name } });

      for (const due of dates) {
        const id = `subscription:${subscription.id}:${due}`;
        const existing = await tx.transaction.findUnique({ where: { id }, select: { id: true } });
        if (existing) continue;
        await tx.transaction.create({ data: {
          id, userId, accountId: account.id, categoryId: category.id, merchantId: merchant.id,
          paymentMethodId: payment.id, amountPaise: subscription.amountPaise, type: "expense",
          intent: "Planned", note: "Scheduled subscription debit in MoneyFlow", occurredAt: atNoonUtc(due),
        } });
        await tx.account.update({ where: { id: account.id }, data: { balancePaise: { increment: account.kind === "credit" ? subscription.amountPaise : -subscription.amountPaise } } });
      }
      await tx.subscription.update({ where: { id: subscription.id }, data: { nextDueAt: atNoonUtc(nextDue) } });
      await tx.recurringTransaction.updateMany({ where: { userId, subscriptionId: subscription.id }, data: { nextDueAt: atNoonUtc(nextDue) } });
      changed = true;
    }
    if (changed) await tx.user.update({ where: { id: userId }, data: { workspaceVersion: { increment: 1 } } });
  }, { timeout: 30000 });
}
