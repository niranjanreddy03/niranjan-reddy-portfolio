export type Category = "Groceries" | "Food & Dining" | "Transport" | "Fuel" | "Shopping" | "Bills" | "Entertainment" | "Health" | "Education" | "Travel" | "Rent" | "Investments" | "Misc" | "Other" | string;
export type Transaction = { id: string; date: string; merchant: string; amount: number; type: "expense" | "income"; category: Category; payment: string; accountId: string; intent?: "Necessary" | "Planned" | "Optional" | "Impulsive"; note?: string };
export type Account = { id: string; name: string; kind: "bank" | "cash" | "credit" | "wallet" | "investment"; balance: number; limit?: number; dueDay?: number; color: string };
export type Upcoming = { id: string; name: string; amount: number; due: string; category: Category; recurring: boolean; priority: "Normal" | "High"; paid?: boolean; subscriptionId?: string };
export type Subscription = { id: string; name: string; amount: number; status: "Active" | "Paused" | "Cancelled"; dueDay: number; color: string; accountId?: string; nextDue?: string };
export type Goal = { id: string; name: string; target: number; saved: number; icon: string; color: string; contributions?: { id: string; amount: number; date: string }[] };
export type SharedExpense = { id: string; person: string; description: string; amount: number; date: string; direction: "owed_to_me" | "i_owe"; settled: boolean };
export type FinanceData = { transactions: Transaction[]; accounts: Account[]; upcoming: Upcoming[]; subscriptions: Subscription[]; goals: Goal[]; sharedExpenses: SharedExpense[]; budgets: Record<string, number>; monthlyBudget: number; customCategories: string[]; notificationPreferences: Record<string, boolean> };
export const defaultNotificationPreferences = { "Upcoming bills": true, "Budget alerts": true, "Credit card due": true, "Recurring payments": true, "Goal contributions": false, "Unusual spending": false };

export const money = (value: number) => {
  const rounded = Math.round(Math.abs(value) * 100) / 100;
  return `${value < 0 ? "−" : ""}₹${rounded.toLocaleString("en-IN", { minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2, maximumFractionDigits: 2 })}`;
};
const sumAmounts = <T extends { amount: number }>(rows: T[]) => rows.reduce((sum, item) => sum + Math.round(item.amount * 100), 0) / 100;
export const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return dayKey(next); };
export const addMonths = (date: Date, months: number) => { const next = new Date(date.getFullYear(), date.getMonth() + months, 1); next.setDate(Math.min(date.getDate(), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate())); return dayKey(next); };
export const monthKey = (date: Date) => dayKey(date).slice(0, 7);
export const displayDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
export const categoryColors: Record<string, string> = { Groceries: "#7d9e6c", "Food & Dining": "#d48b70", Transport: "#7791b6", Fuel: "#b99766", Shopping: "#bb8bba", Bills: "#d0a15f", Entertainment: "#9785bd", Health: "#75a6a0", Education: "#94a88b", Travel: "#92a6bb", Rent: "#ad9980", Investments: "#6f9e8b", Misc: "#9b9cae", Other: "#a1a5ab" };
export const categoryIcons: Record<string, string> = { Groceries: "🛒", "Food & Dining": "🍜", Transport: "🚕", Fuel: "⛽", Shopping: "🛍️", Bills: "💡", Entertainment: "🎟️", Health: "💊", Education: "📚", Travel: "✈️", Rent: "🏠", Investments: "📈", Misc: "✦", Other: "✦" };
export const defaultCategories = Object.keys(categoryColors);
export const paymentMethods = ["UPI", "Cash", "Debit Card", "Credit Card", "Bank Transfer", "Other"];
export const accountPresets = ["PNB", "Bank of Baroda (BOB)", "Jio Finance"] as const;
export const expensePresets = [
  { name: "Blinkit", category: "Groceries", icon: "🛒" },
  { name: "Zepto", category: "Groceries", icon: "🛍️" },
  { name: "Petrol", category: "Fuel", icon: "⛽" },
  { name: "Misc", category: "Misc", icon: "✦" },
] as const;
export const subscriptionPresets = [
  { label: "Prime", name: "Amazon Prime", mark: "P", color: "#3998c7" },
  { label: "Netflix", name: "Netflix", mark: "N", color: "#dd5960" },
  { label: "Instagram", name: "Instagram", mark: "◎", color: "#cb6d9c" },
  { label: "WhatsApp", name: "WhatsApp", mark: "W", color: "#56a979" },
  { label: "iCloud", name: "iCloud", mark: "☁", color: "#7b9cc8" },
] as const;

const aliases: Record<string, string> = { "blinkit.com": "Blinkit", "blink commerce": "Blinkit", blinkit: "Blinkit", zepto: "Zepto", "zepto marketplace": "Zepto", zomato: "Zomato", "zomato ltd": "Zomato", uber: "Uber", "uber india": "Uber", amazon: "Amazon", "amazon pay": "Amazon", swiggy: "Swiggy", netflix: "Netflix", spotify: "Spotify" };
export const normalizeMerchant = (value: string) => aliases[value.trim().toLowerCase()] ?? value.trim().replace(/\s+/g, " ");
export const inferredCategory = (merchant: string): Category => ({ Blinkit: "Groceries", Zepto: "Groceries", Instamart: "Groceries", BigBasket: "Groceries", Zomato: "Food & Dining", Swiggy: "Food & Dining", Uber: "Transport", Ola: "Transport", Rapido: "Transport", Petrol: "Fuel", Amazon: "Shopping", Flipkart: "Shopping", Netflix: "Entertainment", Spotify: "Entertainment", Rent: "Rent", Misc: "Misc" })[normalizeMerchant(merchant)] ?? "Other";
export const uid = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

export function createEmptyData(): FinanceData {
  return { transactions: [], accounts: [], upcoming: [], subscriptions: [], goals: [], sharedExpenses: [], budgets: {}, monthlyBudget: 0, customCategories: [], notificationPreferences: { ...defaultNotificationPreferences } };
}

export function calculate(data: FinanceData, today = new Date()) {
  const month = monthKey(today);
  const previousMonth = monthKey(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const monthTransactions = data.transactions.filter((item) => item.date.startsWith(month));
  const expenses = monthTransactions.filter((item) => item.type === "expense");
  const income = monthTransactions.filter((item) => item.type === "income");
  const spent = sumAmounts(expenses);
  const earned = sumAmounts(income);
  const todaySpent = sumAmounts(expenses.filter((item) => item.date === dayKey(today)));
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysRemaining = Math.max(1, monthEnd.getDate() - today.getDate() + 1);
  const upcoming = data.upcoming.filter((item) => !item.paid && item.due >= dayKey(today) && item.due <= dayKey(monthEnd));
  const upcomingTotal = sumAmounts(upcoming);
  const safeToSpend = Math.max(0, (data.monthlyBudget - spent - upcomingTotal) / daysRemaining);
  const elapsed = Math.max(1, today.getDate());
  const dailyAverage = spent / elapsed;
  const previousExpenses = data.transactions.filter((item) => item.type === "expense" && item.date.startsWith(previousMonth));
  const previousSpent = sumAmounts(previousExpenses);
  const currentVariable = sumAmounts(expenses.filter((item) => !["Rent", "Bills", "Entertainment"].includes(item.category)));
  const historicalVariable = sumAmounts(previousExpenses.filter((item) => !["Rent", "Bills", "Entertainment"].includes(item.category)));
  const previousDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  const currentWeight = previousExpenses.length ? Math.min(.5, elapsed / 30) : 1;
  const forecastDaily = previousExpenses.length ? (1 - currentWeight) * (historicalVariable / previousDays) + currentWeight * (currentVariable / elapsed) : currentVariable / elapsed;
  const projected = spent + forecastDaily * Math.max(0, daysRemaining - 1) + upcomingTotal;
  const categories = Object.entries(expenses.reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] ?? 0) + item.amount; return result; }, {})).sort((a, b) => b[1] - a[1]);
  const merchants = Object.entries(expenses.filter((item) => !["Rent", "Bills"].includes(item.category)).reduce<Record<string, number>>((result, item) => { const key = normalizeMerchant(item.merchant); result[key] = (result[key] ?? 0) + item.amount; return result; }, {})).sort((a, b) => b[1] - a[1]);
  const available = data.accounts.filter((item) => item.kind !== "credit" && item.kind !== "investment").reduce((sum, item) => sum + item.balance, 0);
  const assets = data.accounts.filter((item) => item.kind !== "credit").reduce((sum, item) => sum + item.balance, 0);
  const liabilities = data.accounts.filter((item) => item.kind === "credit").reduce((sum, item) => sum + item.balance, 0);
  return { monthTransactions, expenses, income, spent, earned, todaySpent, daysRemaining, upcoming, upcomingTotal, safeToSpend, dailyAverage, forecastDaily, projected, previousSpent, categories, merchants, available, netWorth: assets - liabilities };
}
