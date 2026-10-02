import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, sameOrigin, sessionUser } from "@/lib/moneyflow-server";
import { settleDueSubscriptions } from "@/lib/moneyflow-subscription-server";
import { defaultCategories, defaultNotificationPreferences, type FinanceData } from "@/lib/moneyflow";

export const runtime = "nodejs";
const amount = z.number().finite().min(0).max(100000000);
const text = z.string().trim().min(1).max(120);
const date = z.iso.date();
const dataSchema = z.object({
  transactions: z.array(z.object({ id: text, date, merchant: text, amount: amount.positive(), type: z.enum(["expense", "income"]), category: text, payment: text, accountId: text, intent: z.enum(["Necessary", "Planned", "Optional", "Impulsive"]).optional(), note: z.string().max(1000).optional() })).max(10000),
  accounts: z.array(z.object({ id: text, name: text, kind: z.enum(["bank", "cash", "credit", "wallet", "investment"]), balance: z.number().finite().min(-100000000).max(100000000), limit: amount.optional(), dueDay: z.number().int().min(1).max(31).optional(), color: z.string().max(20) })).max(100),
  upcoming: z.array(z.object({ id: text, name: text, amount: amount.positive(), due: date, category: text, recurring: z.boolean(), priority: z.enum(["Normal", "High"]), paid: z.boolean().optional(), subscriptionId: text.optional() })).max(1000),
  subscriptions: z.array(z.object({ id: text, name: text, amount: amount.positive(), status: z.enum(["Active", "Paused", "Cancelled"]), dueDay: z.number().int().min(1).max(28), color: z.string().max(20), accountId: text.optional(), nextDue: date.optional() })).max(1000),
  goals: z.array(z.object({ id: text, name: text, target: amount.positive(), saved: amount, icon: z.string().max(10), color: z.string().max(20), contributions: z.array(z.object({ id: text, amount: amount.positive(), date })).max(1000).optional() })).max(1000),
  sharedExpenses: z.array(z.object({ id: text, person: text, description: text, amount: amount.positive(), date, direction: z.enum(["owed_to_me", "i_owe"]), settled: z.boolean() })).max(1000),
  budgets: z.record(z.string().max(120), amount), monthlyBudget: amount, customCategories: z.array(text).max(100), notificationPreferences: z.record(z.string().max(120), z.boolean()),
});
const requestSchema = z.object({ version: z.number().int().min(0), data: dataSchema });
const paise = (rupees: number) => Math.round(rupees * 100);

export async function GET(request: NextRequest) {
  const user = await sessionUser(request);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const todayParts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const todayValue = (type: string) => todayParts.find((part) => part.type === type)?.value ?? "01";
  await settleDueSubscriptions(user.id, `${todayValue("year")}-${todayValue("month")}-${todayValue("day")}`);
  const currentUser = await db.user.findUniqueOrThrow({ where: { id: user.id }, select: { workspaceVersion: true } });
  const [accounts, categories, merchants, payments, transactions, budget, recurring, subscriptions, goals, notifications, sharedExpenses] = await Promise.all([
    db.account.findMany({ where: { userId: user.id } }), db.category.findMany({ where: { userId: user.id } }), db.merchant.findMany({ where: { userId: user.id } }), db.paymentMethod.findMany({ where: { userId: user.id } }), db.transaction.findMany({ where: { userId: user.id }, orderBy: { occurredAt: "desc" } }), db.budget.findFirst({ where: { userId: user.id }, orderBy: { month: "desc" }, include: { categories: true } }), db.recurringTransaction.findMany({ where: { userId: user.id } }), db.subscription.findMany({ where: { userId: user.id } }), db.financialGoal.findMany({ where: { userId: user.id }, include: { contributions: true } }), db.notification.findMany({ where: { userId: user.id } }), db.sharedExpense.findMany({ where: { userId: user.id }, orderBy: { occurredAt: "desc" } }),
  ]);
  const categoryNames = new Map(categories.map((item) => [item.id, item.name]));
  const merchantNames = new Map(merchants.map((item) => [item.id, item.name]));
  const paymentNames = new Map(payments.map((item) => [item.id, item.name]));
  const data: FinanceData = {
    accounts: accounts.map((item) => ({ id: item.id, name: item.name, kind: item.kind as FinanceData["accounts"][number]["kind"], balance: item.balancePaise / 100, limit: item.creditLimitPaise == null ? undefined : item.creditLimitPaise / 100, dueDay: item.dueDay ?? undefined, color: item.color ?? "#89a99d" })),
    transactions: transactions.map((item) => ({ id: item.id, date: item.occurredAt.toISOString().slice(0, 10), merchant: merchantNames.get(item.merchantId ?? "") ?? "Unknown", amount: item.amountPaise / 100, type: item.type as "expense" | "income", category: categoryNames.get(item.categoryId ?? "") ?? "Other", payment: paymentNames.get(item.paymentMethodId ?? "") ?? "Other", accountId: item.accountId, intent: item.intent as FinanceData["transactions"][number]["intent"], note: item.note ?? undefined })),
    upcoming: recurring.map((item) => ({ id: item.id, name: item.name, amount: item.amountPaise / 100, due: item.nextDueAt.toISOString().slice(0, 10), category: categoryNames.get(item.categoryId ?? "") ?? "Other", recurring: item.frequency === "monthly", priority: item.priority as "Normal" | "High", paid: !item.active, subscriptionId: item.subscriptionId ?? undefined })),
    subscriptions: subscriptions.map((item) => ({ id: item.id, name: item.name, amount: item.amountPaise / 100, status: item.status as "Active" | "Paused" | "Cancelled", dueDay: item.dueDay, color: item.color ?? "#89a99d", accountId: item.accountId ?? undefined, nextDue: item.nextDueAt?.toISOString().slice(0, 10) })),
    goals: goals.map((item) => ({ id: item.id, name: item.name, target: item.targetPaise / 100, saved: item.savedPaise / 100, icon: item.icon ?? "✦", color: item.color ?? "#89a99d", contributions: item.contributions.map((contribution) => ({ id: contribution.id, amount: contribution.amountPaise / 100, date: contribution.occurredAt.toISOString().slice(0, 10) })) })),
    sharedExpenses: sharedExpenses.map((item) => ({ id: item.id, person: item.person, description: item.description, amount: item.amountPaise / 100, date: item.occurredAt.toISOString().slice(0, 10), direction: item.direction as "owed_to_me" | "i_owe", settled: item.settled })),
    budgets: Object.fromEntries((budget?.categories ?? []).map((item) => [categoryNames.get(item.categoryId) ?? "Other", item.amountPaise / 100])),
    monthlyBudget: budget?.amountPaise ? budget.amountPaise / 100 : 0,
    customCategories: categories.map((item) => item.name).filter((name) => !defaultCategories.includes(name)),
    notificationPreferences: { ...defaultNotificationPreferences, ...Object.fromEntries(notifications.map((item) => [item.kind, item.enabled])) },
  };
  return NextResponse.json({ version: currentUser.workspaceVersion, data }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const user = await sessionUser(request);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid financial data", details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  const { data, version } = parsed.data;
  const accountIds = new Set(data.accounts.map((item) => item.id));
  if (data.transactions.some((item) => !accountIds.has(item.accountId))) return NextResponse.json({ error: "Transaction account missing" }, { status: 400 });
  if (data.subscriptions.some((item) => (item.accountId && (!accountIds.has(item.accountId) || !item.nextDue)) || (!item.accountId && item.nextDue))) return NextResponse.json({ error: "Subscription account or renewal date missing" }, { status: 400 });
  const subscriptionIds = new Set(data.subscriptions.map((item) => item.id));
  if (data.upcoming.some((item) => item.subscriptionId && !subscriptionIds.has(item.subscriptionId))) return NextResponse.json({ error: "Scheduled subscription missing" }, { status: 400 });
  try {
    const nextVersion = await db.$transaction(async (tx) => {
      const updated = await tx.user.updateMany({ where: { id: user.id, workspaceVersion: version }, data: { workspaceVersion: { increment: 1 } } });
      if (!updated.count) throw new Error("VERSION_CONFLICT");
      await tx.receipt.deleteMany({ where: { userId: user.id } });
      await tx.transaction.deleteMany({ where: { userId: user.id } });
      await tx.import.deleteMany({ where: { userId: user.id } });
      await tx.budgetCategory.deleteMany({ where: { budget: { userId: user.id } } });
      await tx.budget.deleteMany({ where: { userId: user.id } });
      await tx.recurringTransaction.deleteMany({ where: { userId: user.id } });
      await tx.subscription.deleteMany({ where: { userId: user.id } });
      await tx.goalContribution.deleteMany({ where: { goal: { userId: user.id } } });
      await tx.financialGoal.deleteMany({ where: { userId: user.id } });
      await tx.notification.deleteMany({ where: { userId: user.id } });
      await tx.sharedExpense.deleteMany({ where: { userId: user.id } });
      await tx.account.deleteMany({ where: { userId: user.id } });
      await tx.merchant.deleteMany({ where: { userId: user.id } });
      await tx.paymentMethod.deleteMany({ where: { userId: user.id } });
      await tx.category.deleteMany({ where: { userId: user.id } });
      const names = [...new Set([...defaultCategories, ...data.customCategories, ...data.transactions.map((item) => item.category), ...data.upcoming.map((item) => item.category), ...Object.keys(data.budgets)])];
      await tx.category.createMany({ data: names.map((name) => ({ userId: user.id, name })) });
      const categories = new Map((await tx.category.findMany({ where: { userId: user.id }, select: { id: true, name: true } })).map((item) => [item.name, item.id]));
      const merchantNames = [...new Set(data.transactions.map((item) => item.merchant))];
      if (merchantNames.length) await tx.merchant.createMany({ data: merchantNames.map((name) => ({ userId: user.id, name })) });
      const merchants = new Map((await tx.merchant.findMany({ where: { userId: user.id }, select: { id: true, name: true } })).map((item) => [item.name, item.id]));
      const paymentNames = [...new Set(data.transactions.map((item) => item.payment))];
      if (paymentNames.length) await tx.paymentMethod.createMany({ data: paymentNames.map((name) => ({ userId: user.id, name })) });
      const payments = new Map((await tx.paymentMethod.findMany({ where: { userId: user.id }, select: { id: true, name: true } })).map((item) => [item.name, item.id]));
      if (data.accounts.length) await tx.account.createMany({ data: data.accounts.map((item) => ({ id: item.id, userId: user.id, name: item.name, kind: item.kind, balancePaise: paise(item.balance), creditLimitPaise: item.limit == null ? null : paise(item.limit), dueDay: item.dueDay, color: item.color })) });
      if (data.transactions.length) await tx.transaction.createMany({ data: data.transactions.map((item) => ({ id: item.id, userId: user.id, accountId: item.accountId, categoryId: categories.get(item.category), merchantId: merchants.get(item.merchant), paymentMethodId: payments.get(item.payment), amountPaise: paise(item.amount), type: item.type, intent: item.intent, note: item.note, occurredAt: new Date(`${item.date}T12:00:00Z`) })) });
      const now = new Date(); const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const budget = await tx.budget.create({ data: { userId: user.id, month, amountPaise: paise(data.monthlyBudget) } });
      const budgetLines = Object.entries(data.budgets).map(([name, value]) => ({ budgetId: budget.id, categoryId: categories.get(name)!, amountPaise: paise(value) }));
      if (budgetLines.length) await tx.budgetCategory.createMany({ data: budgetLines });
      if (data.upcoming.length) await tx.recurringTransaction.createMany({ data: data.upcoming.map((item) => ({ id: item.id, userId: user.id, name: item.name, amountPaise: paise(item.amount), categoryId: categories.get(item.category), frequency: item.recurring ? "monthly" : "once", nextDueAt: new Date(`${item.due}T12:00:00Z`), priority: item.priority, active: !item.paid, subscriptionId: item.subscriptionId })) });
      if (data.subscriptions.length) await tx.subscription.createMany({ data: data.subscriptions.map((item) => ({ id: item.id, userId: user.id, name: item.name, amountPaise: paise(item.amount), status: item.status, dueDay: item.dueDay, color: item.color, accountId: item.accountId, nextDueAt: item.nextDue ? new Date(`${item.nextDue}T12:00:00Z`) : null })) });
      if (data.goals.length) await tx.financialGoal.createMany({ data: data.goals.map((item) => ({ id: item.id, userId: user.id, name: item.name, targetPaise: paise(item.target), savedPaise: paise(item.saved), icon: item.icon, color: item.color })) });
      if (data.sharedExpenses.length) await tx.sharedExpense.createMany({ data: data.sharedExpenses.map((item) => ({ id: item.id, userId: user.id, person: item.person, description: item.description, amountPaise: paise(item.amount), direction: item.direction, occurredAt: new Date(`${item.date}T12:00:00Z`), settled: item.settled })) });
      const contributions = data.goals.flatMap((goal) => (goal.contributions ?? []).map((item) => ({ id: item.id, goalId: goal.id, amountPaise: paise(item.amount), occurredAt: new Date(`${item.date}T12:00:00Z`) })));
      if (contributions.length) await tx.goalContribution.createMany({ data: contributions });
      const preferences = Object.entries(data.notificationPreferences);
      if (preferences.length) await tx.notification.createMany({ data: preferences.map(([kind, enabled]) => ({ userId: user.id, kind, enabled })) });
      return version + 1;
    }, { timeout: 30000 });
    return NextResponse.json({ version: nextVersion });
  } catch (error) {
    if (error instanceof Error && error.message === "VERSION_CONFLICT") return NextResponse.json({ error: "This workspace changed in another tab. Reload to see the latest data." }, { status: 409 });
    return NextResponse.json({ error: "Could not save your changes" }, { status: 500 });
  }
}
