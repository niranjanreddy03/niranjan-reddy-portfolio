import { dayKey, inferredCategory, normalizeMerchant } from "./moneyflow";

export type ReceiptResult = { merchant: string; amount: number; date: string; items: string[]; raw: string };
export function parseReceiptText(raw: string): ReceiptResult {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const merchant = normalizeMerchant(lines.find((line) => /[A-Za-z]{3}/.test(line) && !/^(invoice|tax|receipt|bill|date)\b/i.test(line)) ?? "");
  const amounts = lines.map((line) => ({ line, value: [...line.matchAll(/(?:₹|rs\.?\s*)?(\d{1,7}(?:,\d{3})*(?:\.\d{2})?)/gi)].map((match) => Number(match[1].replaceAll(",", ""))).filter((value) => value > 0 && value < 1000000) }));
  const totalLine = [...amounts].reverse().find(({ line, value }) => /(?:grand\s+total|total\s+payable|amount\s+due|total)/i.test(line) && value.length);
  const amount = totalLine ? totalLine.value.at(-1)! : Math.max(0, ...amounts.flatMap((item) => item.value));
  const dateMatch = raw.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/) ?? raw.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/);
  let date = dayKey(new Date());
  if (dateMatch) {
    const yearFirst = dateMatch[1].length === 4;
    const year = yearFirst ? dateMatch[1] : dateMatch[3];
    const month = yearFirst ? dateMatch[2] : dateMatch[2];
    const day = yearFirst ? dateMatch[3] : dateMatch[1];
    const candidate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    if (!Number.isNaN(Date.parse(`${candidate}T12:00:00`))) date = candidate;
  }
  const items = lines.filter((line) => /[A-Za-z]{2}/.test(line) && /\d/.test(line) && !/(total|tax|gst|invoice|date|phone|mobile|order)/i.test(line)).slice(0, 15);
  return { merchant, amount, date, items, raw };
}
export const receiptCategory = (result: ReceiptResult) => inferredCategory(result.merchant);
