"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, Plus, RotateCcw, Trash2, Users } from "lucide-react";
import { displayDate, money, uid, type SharedExpense } from "@/lib/moneyflow";

type Props = {
  items: SharedExpense[];
  todayKey: string;
  onChange: (update: (current: SharedExpense[]) => SharedExpense[]) => void;
};

export function SplitwiseSection({ items, todayKey, onChange }: Props) {
  const [direction, setDirection] = useState<SharedExpense["direction"]>("owed_to_me");
  const [showSettled, setShowSettled] = useState(false);
  const open = items.filter((item) => !item.settled);
  const settled = items.filter((item) => item.settled);
  const owedToMe = open.filter((item) => item.direction === "owed_to_me").reduce((sum, item) => sum + item.amount, 0);
  const iOwe = open.filter((item) => item.direction === "i_owe").reduce((sum, item) => sum + item.amount, 0);
  const sorted = [...(showSettled ? settled : open)].sort((a, b) => b.date.localeCompare(a.date));

  const add = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const person = String(values.get("person") ?? "").trim();
    const description = String(values.get("description") ?? "").trim();
    const amount = Math.round(Number(values.get("amount")) * 100) / 100;
    const date = String(values.get("date") ?? "");
    if (!person || !description || !Number.isFinite(amount) || amount <= 0 || amount > 100000000 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    onChange((current) => [{ id: uid(), person, description, amount, date, direction, settled: false }, ...current]);
    form.reset();
  };

  const toggleSettled = (id: string) => onChange((current) => current.map((item) => item.id === id ? { ...item, settled: !item.settled } : item));
  const remove = (item: SharedExpense) => {
    if (!window.confirm(`Remove the shared expense “${item.description}” with ${item.person}?`)) return;
    onChange((current) => current.filter((entry) => entry.id !== item.id));
  };

  return <>
    <div className="mf-page-head"><div><span className="mf-eyebrow">SHARED MONEY, MADE SIMPLE</span><h1>Splitwise</h1><p>Keep track of who owes whom, all in one place.</p></div></div>
    <div className="mf-shared-note"><Users size={17} /><span>Manual tracker inside MoneyFlow. Balances here do not change your financial accounts, and this section does not sync with Splitwise.</span></div>
    <div className="mf-shared-stats">
      <div><span><ArrowDownLeft size={18} /> YOU ARE OWED</span><strong>{money(owedToMe)}</strong><small>From open shared expenses</small></div>
      <div><span><ArrowUpRight size={18} /> YOU OWE</span><strong>{money(iOwe)}</strong><small>Waiting for your settlement</small></div>
      <div><span><Users size={18} /> NET BALANCE</span><strong>{money(owedToMe - iOwe)}</strong><small>Across everyone you track</small></div>
    </div>
    <div className="mf-shared-layout">
      <section className="mf-panel mf-shared-form-panel">
        <span className="mf-eyebrow">NEW SHARED EXPENSE</span><h2>Add a balance</h2>
        <div className="mf-shared-direction" role="group" aria-label="Who owes whom">
          <button type="button" className={direction === "owed_to_me" ? "active" : ""} onClick={() => setDirection("owed_to_me")}>Someone owes me</button>
          <button type="button" className={direction === "i_owe" ? "active" : ""} onClick={() => setDirection("i_owe")}>I owe someone</button>
        </div>
        <form className="mf-simple-form" onSubmit={add}>
          <label>Person<input name="person" required maxLength={120} placeholder="Friend's name" /></label>
          <label>For what?<input name="description" required maxLength={120} placeholder="Dinner, trip, groceries…" /></label>
          <div className="mf-shared-field-row"><label>Amount (₹)<input name="amount" type="number" min="0.01" max="100000000" step="0.01" required placeholder="0.00" /></label><label>Date<input name="date" type="date" required defaultValue={todayKey} /></label></div>
          <button className="mf-primary mf-submit" type="submit"><Plus size={16} /> Add shared expense</button>
        </form>
      </section>
      <section className="mf-panel mf-shared-list-panel">
        <div className="mf-section-heading"><div><span className="mf-eyebrow">YOUR SHARED BALANCES</span><h2>{showSettled ? "Settled expenses" : "Open expenses"}</h2></div><div className="mf-shared-tabs"><button className={!showSettled ? "active" : ""} onClick={() => setShowSettled(false)}>Open {open.length}</button><button className={showSettled ? "active" : ""} onClick={() => setShowSettled(true)}>Settled {settled.length}</button></div></div>
        {sorted.length ? <div className="mf-shared-list">{sorted.map((item) => <div className="mf-shared-row" key={item.id}><span className={`mf-shared-person-icon ${item.direction === "i_owe" ? "out" : ""}`}>{item.person.slice(0, 1).toUpperCase()}</span><div className="mf-shared-row-main"><strong>{item.person}</strong><span>{item.description} · {displayDate(item.date)}</span><small>{item.direction === "owed_to_me" ? "Owes you" : "You owe"}</small></div><b className={item.direction === "i_owe" ? "out" : ""}>{item.direction === "i_owe" ? "−" : "+"}{money(item.amount)}</b><div className="mf-shared-actions"><button type="button" className="mf-outline" onClick={() => toggleSettled(item.id)}>{item.settled ? <RotateCcw size={14} /> : <Check size={14} />}{item.settled ? "Reopen" : "Settle"}</button><button type="button" className="mf-icon-button" onClick={() => remove(item)} aria-label={`Remove ${item.description} with ${item.person}`}><Trash2 size={15} /></button></div></div>)}</div> : <div className="mf-shared-empty"><Users size={28} /><strong>{showSettled ? "Nothing settled yet" : "No shared expenses yet"}</strong><span>{showSettled ? "Settled balances will appear here." : "Add a real balance to start tracking it."}</span></div>}
      </section>
    </div>
  </>;
}
