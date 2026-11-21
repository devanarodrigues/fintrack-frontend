// Angular 18 — AnalyticsService com integração à API BFF
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  // private apiUrl = 'http://localhost:5000/api/v1';
  private apiUrl = 'https://fintrack-bff.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  // Buscar linha do tempo de gastos com projeção de parcelas futuras
  getTimeline(months: number = 6): Observable<{ items: any[] }> {
    return this.http.get<{ items: any[] }>(`${this.apiUrl}/analytics/timeline`, {
      params: { months: months.toString() }
    });
  }

  // Buscar tendência mensal de gastos
  getMonthlyTrend(months: number = 12): Observable<{ items: any[] }> {
    return this.http.get<{ items: any[] }>(`${this.apiUrl}/analytics/monthly-trend`, {
      params: { months: months.toString() }
    });
  }

  // Gerar relatório PDF de gastos
  generateExpensesPDF(filters?: {
    month?: number;
    year?: number;
    card?: string;
    category?: string;
  }): Observable<Blob> {
    const params: any = {};
    if (filters?.month) params.month = filters.month;
    if (filters?.year) params.year = filters.year;
    if (filters?.card) params.card = filters.card;
    if (filters?.category) params.category = filters.category;

    return this.http.get(`${this.apiUrl}/reports/expenses-pdf`, {
      params,
      responseType: 'blob'
    });
  }
}
