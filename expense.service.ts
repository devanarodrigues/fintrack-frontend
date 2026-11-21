// Angular 18 — ExpenseService com integração à API BFF
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense, DashboardKPIs } from '../models/expense.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  // private apiUrl = 'http://localhost:5000/api/v1';
  private apiUrl = 'https://fintrack-bff.vercel.app/api/v1';
  private _expenses = signal<Expense[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  expenses = this._expenses.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  total = computed(() => this._expenses().reduce((s, e) => s + e.valorParcela, 0));
  count = computed(() => this._expenses().length);
  maxValue = computed(() => Math.max(0, ...this._expenses().map(e => e.valorParcela)));

  constructor(private http: HttpClient) {}

  // Carregar gastos da API
  loadExpenses(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    card?: string;
    month?: number;
    year?: number;
  }): Observable<any> {
    this._loading.set(true);
    this._error.set(null);

    const params: any = {};
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.card) params.card = filters.card;
    if (filters?.month) params.month = filters.month;
    if (filters?.year) params.year = filters.year;

    return this.http.get<any>(`${this.apiUrl}/expenses`, { params });
  }

  // Buscar gasto por ID
  getExpenseById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/expenses/${id}`);
  }

  // Criar novo gasto
  createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense);
  }

  // Atualizar gasto
  updateExpense(id: string, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/expenses/${id}`, expense);
  }

  // Deletar gasto
  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/expenses/${id}`);
  }

  // Buscar parcelas de um gasto
  getInstallments(id: string): Observable<{ items: Expense[] }> {
    return this.http.get<{ items: Expense[] }>(`${this.apiUrl}/expenses/${id}/installments`);
  }

  // Buscar resumo do dashboard
  getDashboardSummary(month?: number, year?: number): Observable<DashboardKPIs> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    return this.http.get<DashboardKPIs>(`${this.apiUrl}/dashboard/summary`, { params });
  }

  // Buscar resumo por cartão
  getCardsSummary(month?: number, year?: number): Observable<{ items: any[] }> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    return this.http.get<{ items: any[] }>(`${this.apiUrl}/dashboard/cards`, { params });
  }

  // Buscar resumo por categoria
  getCategoriesSummary(month?: number, year?: number): Observable<{ items: any[] }> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    return this.http.get<{ items: any[] }>(`${this.apiUrl}/dashboard/categories`, { params });
  }

  // Atualizar estado local
  updateLocalExpenses(expenses: Expense[]): void {
    this._expenses.set(expenses);
  }

  // Adicionar gasto localmente
  addLocal(e: Expense): void {
    this._expenses.update(list => [e, ...list]);
  }

  // Atualizar gasto localmente
  updateLocal(id: string, patch: Partial<Expense>): void {
    this._expenses.update(list =>
      list.map(e => e.id === id ? { ...e, ...patch } : e)
    );
  }

  // Remover gasto localmente
  removeLocal(id: string): void {
    this._expenses.update(list => list.filter(e => e.id !== id));
  }

  // Filtrar gastos localmente
  filter(search: string, cat: string, card: string): Expense[] {
    return this._expenses().filter(e => {
      if (search && !e.descricao.toLowerCase().includes(search.toLowerCase())) return false;
      if (cat && e.categoria !== cat) return false;
      if (card && e.cartaoNome !== card) return false;
      return true;
    });
  }

  // Calcular KPIs localmente (para compatibilidade)
  getKPIs(): DashboardKPIs {
    const list = this._expenses();
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed
    const year = now.getFullYear();

    const thisMonth = list.filter(e => {
      const d = new Date(e.data);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    const cardTotals = thisMonth.reduce((acc, e) => {
      acc[e.cartaoNome] = (acc[e.cartaoNome] || 0) + e.valorParcela;
      return acc;
    }, {} as Record<string, number>);

    const topCard = Object.entries(cardTotals).sort((a, b) => b[1] - a[1])[0];
    const totalMonth = thisMonth.reduce((s, e) => s + e.valorParcela, 0);
    const biggest = [...thisMonth].sort((a, b) => b.valorParcela - a.valorParcela)[0] || null;
    const fixed = list.filter(e => e.tipo === 'fixo').reduce((s, e) => s + e.valorParcela, 0);
    const future = list.filter(e => e.tipo === 'parcelado').reduce((s, e) => s + e.valorParcela, 0);

    return {
      totalMonth,
      topCard: topCard?.[0] || '—',
      topCardPct: topCard ? Math.round((topCard[1] / totalMonth) * 100) : 0,
      biggestExpense: biggest,
      futureInstall: future,
      fixedExpenses: fixed,
      nextMonthForecast: fixed + future * 0.5,
    };
  }

  // Limpar erros
  clearError(): void {
    this._error.set(null);
  }
}
