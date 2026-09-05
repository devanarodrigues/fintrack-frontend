// Angular 18 — ExpenseService com Signals
import { Injectable, signal, computed } from '@angular/core';
import { Expense, DashboardKPIs } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private _expenses = signal<Expense[]>([]);

  expenses  = this._expenses.asReadonly();
  total     = computed(() => this._expenses().reduce((s, e) => s + e.value, 0));
  count     = computed(() => this._expenses().length);
  maxValue  = computed(() => Math.max(0, ...this._expenses().map(e => e.value)));

  add(e: Omit<Expense, 'id'>): void {
    this._expenses.update(list => [{ id: crypto.randomUUID(), ...e }, ...list]);
  }

  update(id: string, patch: Partial<Expense>): void {
    this._expenses.update(list =>
      list.map(e => e.id === id ? { ...e, ...patch } : e)
    );
  }

  remove(id: string): void {
    this._expenses.update(list => list.filter(e => e.id !== id));
  }

  filter(search: string, cat: string, card: string): Expense[] {
    return this._expenses().filter(e => {
      if (search && !e.desc.toLowerCase().includes(search.toLowerCase())) return false;
      if (cat    && e.category !== cat)  return false;
      if (card   && e.card     !== card) return false;
      return true;
    });
  }

  getKPIs(): DashboardKPIs {
    const list = this._expenses();
    const now   = new Date();
    const month = now.getMonth();
    const year  = now.getFullYear();

    const thisMonth = list.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const cardTotals = thisMonth.reduce((acc, e) => {
      acc[e.card] = (acc[e.card] || 0) + e.value;
      return acc;
    }, {} as Record<string, number>);

    const topCard    = Object.entries(cardTotals).sort((a, b) => b[1] - a[1])[0];
    const totalMonth = thisMonth.reduce((s, e) => s + e.value, 0);
    const biggest    = [...thisMonth].sort((a, b) => b.value - a.value)[0] || null;
    const fixed      = list.filter(e => e.type === 'fixed').reduce((s, e) => s + e.value, 0);
    const future     = list.filter(e => e.type === 'installment').reduce((s, e) => s + e.value, 0);

    return {
      totalMonth,
      topCard:    topCard?.[0] || '—',
      topCardPct: topCard ? Math.round((topCard[1] / totalMonth) * 100) : 0,
      biggestExpense: biggest,
      futureInstall: future,
      fixedExpenses: fixed,
      nextMonthForecast: fixed + future * 0.5,
    };
  }
}
