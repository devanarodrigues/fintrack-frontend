// Angular 18 — Standalone Architecture
export type ExpenseType = 'single' | 'fixed' | 'installment';

export interface Expense {
  id: string;
  desc: string;
  value: number;
  date: string;           // ISO YYYY-MM-DD
  card: string;
  category: string;
  type: ExpenseType;
  installCurr?: number;
  installTotal?: number;
  notes?: string;
}

export interface UploadStatus {
  phase: 'idle' | 'uploading' | 'validating' | 'extracting' | 'done' | 'error';
  progress: number;
  message?: string;
  count?: number;
}

export interface DashboardKPIs {
  totalMonth: number;
  topCard: string;
  topCardPct: number;
  biggestExpense: Expense | null;
  futureInstall: number;
  fixedExpenses: number;
  nextMonthForecast: number;
}
