// Angular 18 — Standalone Architecture
export type ExpenseType = 'normal' | 'parcelado' | 'fixo';

export interface Expense {
  id: string;
  gastoPaiId?: string;
  data: string;           // ISO YYYY-MM-DD
  cartaoNome: string;
  categoria: string;
  descricao: string;
  valorParcela: number;
  tipo: ExpenseType;
  parcelaAtual: number;
  totalParcelas: number;
  origem: 'manual' | 'fatura';
  observacao?: string;
  cartaoId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UploadStatus {
  phase: 'idle' | 'uploading' | 'validating' | 'extracting' | 'done' | 'error';
  progress: number;
  message?: string;
  count?: number;
}

export interface DashboardKPIs {
  total_month: number;
  top_card: string;
  top_card_pct: number;
  biggest_expense: {
    id: string;
    descricao: string;
    valor_parcela: number;
    data: string;
    cartao_nome: string;
    categoria: string;
  } | null;
  future_installments: number;
  fixed_expenses: number;
  next_month_forecast: number;
  total_expenses_count: number;
  active_installments_count: number;
}
