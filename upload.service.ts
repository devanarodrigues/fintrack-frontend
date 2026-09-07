// Angular 18 — UploadService com integração à API BFF
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadStatus } from '../models/expense.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  // private apiUrl = 'http://localhost:5000/api/v1';
  private apiUrl = 'https://fintrack-bff.vercel.app/api/v1';
  status = signal<UploadStatus>({ phase: 'idle', progress: 0 });

  constructor(private http: HttpClient) {}

  // Upload de fatura para processamento OCR
  uploadInvoice(file: File, card: string, month: number, year: number): Observable<any> {
    const VALID_TYPES = ['application/pdf'];
    const MAX_SIZE = 10 * 1024 * 1024;

    // Validar formato
    if (!VALID_TYPES.includes(file.type) && !file.name.endsWith('.pdf')) {
      this.status.set({ phase: 'error', progress: 0, message: 'Apenas PDFs são aceitos.' });
      throw new Error('Apenas PDFs são aceitos.');
    }

    // Validar tamanho
    if (file.size > MAX_SIZE) {
      this.status.set({ phase: 'error', progress: 0, message: 'Arquivo maior que 10 MB.' });
      throw new Error('Arquivo maior que 10 MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('card', card);
    formData.append('month', String(month));
    formData.append('year', String(year));

    this.status.set({ phase: 'uploading', progress: 20 });

    return this.http.post(`${this.apiUrl}/invoices/upload`, formData);
  }

  // Confirmar e salvar transações extraídas
  confirmInvoice(processingId: string, transactions: any[]): Observable<any> {
    this.status.set({ phase: 'validating', progress: 50 });

    return this.http.post(`${this.apiUrl}/invoices/confirm`, {
      processing_id: processingId,
      transactions: transactions
    });
  }

  // Método legado para compatibilidade
  async upload(file: File, card: string, month: number, year: number): Promise<void> {
    try {
      this.status.set({ phase: 'uploading', progress: 20 });

      const result = await this.uploadInvoice(file, card, month, year).toPromise();

      this.status.set({ phase: 'extracting', progress: 80 });
      this.status.set({ phase: 'done', progress: 100, count: result?.total_count || 0 });

    } catch (err: any) {
      this.status.set({
        phase: 'error', progress: 0,
        message: err?.error?.message || err?.message || 'Falha no processamento da fatura.'
      });
    }
  }

  reset(): void {
    this.status.set({ phase: 'idle', progress: 0 });
  }
}
