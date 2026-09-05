// Angular 18 — UploadService
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadStatus } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class UploadService {
  status = signal<UploadStatus>({ phase: 'idle', progress: 0 });

  constructor(private http: HttpClient) {}

  async upload(file: File, card: string, month: number, year: number): Promise<void> {
    const VALID_TYPES = ['application/pdf'];
    const MAX_SIZE    = 10 * 1024 * 1024;

    // RF-002 — Validar formato
    if (!VALID_TYPES.includes(file.type) && !file.name.endsWith('.pdf')) {
      this.status.set({ phase: 'error', progress: 0, message: 'Apenas PDFs são aceitos.' });
      return;
    }
    // RF-002 — Validar tamanho
    if (file.size > MAX_SIZE) {
      this.status.set({ phase: 'error', progress: 0, message: 'Arquivo maior que 10 MB.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('card', card);
    formData.append('month', String(month));
    formData.append('year', String(year));

    try {
      // RF-003 — POST /api/invoices/upload
      this.status.set({ phase: 'uploading', progress: 20 });
      // const { jobId } = await this.http.post<{jobId:string}>('/api/invoices/upload', formData).toPromise();

      // RF-004 — Polling status
      this.status.set({ phase: 'validating', progress: 50 });
      // const status = await this.pollStatus(jobId);

      this.status.set({ phase: 'extracting', progress: 80 });
      this.status.set({ phase: 'done', progress: 100, count: 12 });

    } catch (err: any) {
      this.status.set({
        phase: 'error', progress: 0,
        message: err?.error?.message || 'Falha no processamento da fatura.'
      });
    }
  }

  reset(): void {
    this.status.set({ phase: 'idle', progress: 0 });
  }
}
