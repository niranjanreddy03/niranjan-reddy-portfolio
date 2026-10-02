import test from "node:test";
import assert from "node:assert/strict";
import { dueSubscriptionRenewals, nextSubscriptionRenewal } from "../lib/moneyflow-subscription-schedule.ts";

test("a new subscription starts with a future renewal, including when added on its due day", () => {
  assert.equal(nextSubscriptionRenewal(5, "2026-10-02"), "2026-10-05");
  assert.equal(nextSubscriptionRenewal(2, "2026-10-02"), "2026-11-02");
  assert.equal(nextSubscriptionRenewal(28, "2026-12-31"), "2027-01-28");
});

test("missed renewals are each recorded once and the next date advances", () => {
  assert.deepEqual(dueSubscriptionRenewals("2026-01-05", 5, "2026-03-07"), {
    dates: ["2026-01-05", "2026-02-05", "2026-03-05"], nextDue: "2026-04-05",
  });
  assert.deepEqual(dueSubscriptionRenewals("2026-04-05", 5, "2026-03-07"), {
    dates: [], nextDue: "2026-04-05",
  });
});

test("catch-up work is bounded for a long inactive period", () => {
  const result = dueSubscriptionRenewals("2020-01-15", 15, "2026-10-02", 3);
  assert.deepEqual(result.dates, ["2020-01-15", "2020-02-15", "2020-03-15"]);
  assert.equal(result.nextDue, "2020-04-15");
});
