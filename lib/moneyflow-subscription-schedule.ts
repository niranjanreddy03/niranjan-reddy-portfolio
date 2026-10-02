const isoDay = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export function nextSubscriptionRenewal(dueDay: number, afterDay: string) {
  const year = Number(afterDay.slice(0, 4));
  const month = Number(afterDay.slice(5, 7));
  const thisMonth = isoDay(year, month, dueDay);
  if (thisMonth > afterDay) return thisMonth;
  const next = new Date(Date.UTC(year, month, dueDay, 12));
  return next.toISOString().slice(0, 10);
}

export function dueSubscriptionRenewals(nextDue: string, dueDay: number, throughDay: string, limit = 120) {
  const dates: string[] = [];
  let due = nextDue;
  while (due <= throughDay && dates.length < limit) {
    dates.push(due);
    const year = Number(due.slice(0, 4));
    const month = Number(due.slice(5, 7));
    due = new Date(Date.UTC(year, month, dueDay, 12)).toISOString().slice(0, 10);
  }
  return { dates, nextDue: due };
}
