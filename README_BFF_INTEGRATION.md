# FinTrack Frontend - Integração com BFF

Guia de integração do frontend Angular com a API BFF (Backend for Frontend).

## 📋 Visão Geral

O frontend Angular foi atualizado para consumir a API BFF real em vez de usar dados simulados. A integração é feita através dos serviços que agora fazem chamadas HTTP para a API Flask rodando em `http://localhost:5000`.

## 🔗 Conexão com a API

### URL Base da API

A URL base da API está configurada nos serviços:

```typescript
// private apiUrl = 'http://localhost:5000/api/v1';
  private apiUrl = 'https://fintrack-bff.vercel.app/api/v1';
```

### Configuração de CORS

A API BFF já está configurada com CORS habilitado para aceitar requisições do frontend. Se precisar mudar a origem, edite `bff/app.py`:

```python
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
```

## 📁 Serviços Atualizados

### 1. ExpenseService

Serviço principal para gerenciamento de gastos.

#### Métodos Disponíveis

```typescript
// Carregar gastos da API
loadExpenses(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  card?: string;
  month?: number;
  year?: number;
}): Observable<any>

// Buscar gasto por ID
getExpenseById(id: string): Observable<Expense>

// Criar novo gasto
createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Observable<Expense>

// Atualizar gasto
updateExpense(id: string, expense: Partial<Expense>): Observable<Expense>

// Deletar gasto
deleteExpense(id: string): Observable<any>

// Buscar parcelas de um gasto
getInstallments(id: string): Observable<{ items: Expense[] }>

// Buscar resumo do dashboard
getDashboardSummary(month?: number, year?: number): Observable<DashboardKPIs>

// Buscar resumo por cartão
getCardsSummary(month?: number, year?: number): Observable<{ items: any[] }>

// Buscar resumo por categoria
getCategoriesSummary(month?: number, year?: number): Observable<{ items: any[] }>
```

#### Exemplo de Uso

```typescript
import { ExpenseService } from './core/services/expense.service';

constructor(private expenseService: ExpenseService) {}

// Carregar gastos
ngOnInit() {
  this.expenseService.loadExpenses({
    page: 1,
    limit: 10,
    month: 9,
    year: 2026
  }).subscribe(response => {
    this.expenses = response.items;
    this.total = response.total;
  });
}

// Criar gasto
criarGasto() {
  const novoGasto = {
    data: '2026-09-06',
    cartaoNome: 'Nubank',
    categoria: 'Alimentação',
    descricao: 'Supermercado',
    valorParcela: 450.00,
    tipo: 'normal',
    parcelaAtual: 1,
    totalParcelas: 1,
    origem: 'manual'
  };

  this.expenseService.createExpense(novoGasto).subscribe(gasto => {
    console.log('Gasto criado:', gasto);
    this.expenses.unshift(gasto);
  });
}

// Atualizar gasto
editarGasto(id: string) {
  this.expenseService.updateExpense(id, {
    descricao: 'Descrição atualizada',
    valorParcela: 500.00
  }).subscribe(gastoAtualizado => {
    console.log('Gasto atualizado:', gastoAtualizado);
  });
}

// Deletar gasto
deletarGasto(id: string) {
  this.expenseService.deleteExpense(id).subscribe(() => {
    this.expenses = this.expenses.filter(e => e.id !== id);
  });
}
```

### 2. UploadService

Serviço para upload de faturas de cartão de crédito.

#### Métodos Disponíveis

```typescript
// Upload de fatura para processamento OCR
uploadInvoice(file: File, card: string, month: number, year: number): Observable<any>

// Confirmar e salvar transações extraídas
confirmInvoice(processingId: string, transactions: any[]): Observable<any>
```

#### Exemplo de Uso

```typescript
import { UploadService } from './core/services/upload.service';

constructor(private uploadService: UploadService) {}

// Upload de fatura
onFileSelected(event: any) {
  const file = event.target.files[0];
  
  this.uploadService.uploadInvoice(file, 'Nubank', 9, 2026).subscribe(result => {
    console.log('Transações extraídas:', result.transactions);
    
    // Mostrar para revisão
    this.transactions = result.transactions;
    this.processingId = result.processingId;
  });
}

// Confirmar transações
confirmarTransacoes() {
  this.uploadService.confirmInvoice(this.processingId, this.transactions).subscribe(saved => {
    console.log('Transações salvas:', saved.saved_count);
    // Recarregar gastos
    this.carregarGastos();
  });
}
```

### 3. AnalyticsService

Novo serviço para analytics e relatórios.

#### Métodos Disponíveis

```typescript
// Buscar linha do tempo de gastos com projeção de parcelas futuras
getTimeline(months: number = 6): Observable<{ items: any[] }>

// Buscar tendência mensal de gastos
getMonthlyTrend(months: number = 12): Observable<{ items: any[] }>

// Gerar relatório PDF de gastos
generateExpensesPDF(filters?: {
  month?: number;
  year?: number;
  card?: string;
  category?: string;
}): Observable<Blob>
```

#### Exemplo de Uso

```typescript
import { AnalyticsService } from './core/services/analytics.service';

constructor(private analyticsService: AnalyticsService) {}

// Buscar linha do tempo
ngOnInit() {
  this.analyticsService.getTimeline(6).subscribe(response => {
    this.timeline = response.items;
  });
}

// Gerar PDF
gerarRelatorio() {
  this.analyticsService.generateExpensesPDF({
    month: 9,
    year: 2026,
    card: 'Nubank'
  }).subscribe(blob => {
    // Download do PDF
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_gastos.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  });
}
```

## 🔄 Mudanças no Modelo de Dados

### Interface Expense Atualizada

```typescript
export interface Expense {
  id: string;
  gastoPaiId?: string;              // ID do gasto principal (para parcelas)
  data: string;                     // YYYY-MM-DD
  cartaoNome: string;
  categoria: string;
  descricao: string;
  valorParcela: number;             // Valor da parcela no mês
  tipo: 'normal' | 'parcelado' | 'fixo';
  parcelaAtual: number;            // Ex: 3
  totalParcelas: number;           // Ex: 10
  origem: 'manual' | 'fatura';
  observacao?: string;
  cartaoId?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Interface DashboardKPIs Atualizada

```typescript
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
```

## 🎯 Integração nos Componentes

### Exemplo: Dashboard Component

```typescript
import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../core/services/expense.service';
import { DashboardKPIs } from '../../core/models/expense.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div *ngIf="kpi">
      <h1>Total do Mês: R$ {{ kpi.total_month | number:'1.2-2' }}</h1>
      <p>Cartão Principal: {{ kpi.top_card }} ({{ kpi.top_card_pct }}%)</p>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  kpi: DashboardKPIs | null = null;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    const now = new Date();
    this.expenseService.getDashboardSummary(
      now.getMonth() + 1,
      now.getFullYear()
    ).subscribe(kpi => {
      this.kpi = kpi;
    });
  }
}
```

### Exemplo: Expenses Component

```typescript
import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../core/services/expense.service';
import { Expense } from '../../core/models/expense.model';

@Component({
  selector: 'app-expenses',
  template: `
    <table>
      <tr *ngFor="let expense of expenses">
        <td>{{ expense.descricao }}</td>
        <td>R$ {{ expense.valorParcela | number:'1.2-2' }}</td>
        <td>
          <span *ngIf="expense.tipo === 'parcelado'">
            {{ expense.parcelaAtual }}/{{ expense.totalParcelas }}
          </span>
        </td>
      </tr>
    </table>
  `
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.carregarGastos();
  }

  carregarGastos() {
    this.expenseService.loadExpenses({ page: 1, limit: 20 }).subscribe(response => {
      this.expenses = response.items;
    });
  }
}
```

## 🛠️ Configuração do HttpClient

Certifique-se de que o HttpClientModule está importado no `app.config.ts` ou `app.module.ts`:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... outros imports
  ],
  // ...
})
export class AppModule { }
```

## 🧪 Testes de Integração

### Testar Conexão com a API

```typescript
// No seu componente
ngOnInit() {
  this.expenseService.loadExpenses({ page: 1, limit: 1 }).subscribe(
    response => {
      console.log('✅ API funcionando:', response);
    },
    error => {
      console.error('❌ Erro na API:', error);
    }
  );
}
```

### Verificar Network Tab

1. Abra o DevTools no navegador (F12)
2. Vá para a aba Network
3. Faça uma ação no frontend
4. Verifique as requisições para `http://localhost:5000`

## 🔧 Troubleshooting

### Erro: "Connection refused"
- Verifique se a API BFF está rodando: `python bff/app.py`
- Confirme que está em `http://localhost:5000`
- Verifique firewall/antivírus

### Erro: "CORS policy"
- Confirme que CORS está habilitado no `bff/app.py`
- Verifique a origem configurada no CORS

### Erro: "404 Not Found"
- Verifique se a URL do endpoint está correta
- Confirme que o blueprint está registrado em `app.py`

### Erro: "500 Internal Server Error"
- Verifique os logs da API BFF
- Confirme que o banco de dados está acessível
- Verifique os dados enviados na requisição

## 📝 Boas Práticas

### 1. Tratamento de Erros

```typescript
this.expenseService.loadExpenses().subscribe({
  next: (response) => {
    this.expenses = response.items;
  },
  error: (error) => {
    console.error('Erro ao carregar gastos:', error);
    this.errorMessage = 'Erro ao carregar dados. Tente novamente.';
  }
});
```

### 2. Loading States

```typescript
loading = true;

this.expenseService.loadExpenses().subscribe(response => {
  this.expenses = response.items;
  this.loading = false;
});
```

### 3. Refresh After Changes

```typescript
this.expenseService.createExpense(novoGasto).subscribe(() => {
  this.carregarGastos(); // Recarregar lista
});
```

## 🚀 Próximos Passos

1. Atualizar todos os componentes para usar os serviços atualizados
2. Implementar tratamento de erros e loading states
3. Adicionar validações de formulário
4. Implementar paginação e filtros
5. Adicionar testes unitários para os serviços

## 📚 Documentação Relacionada

- [README Principal](../README.md) - Visão geral do projeto
- [BFF README](../bff/README.md) - Documentação da API
- [Especificação Funcional](../bff/docs/spec/001.md) - Requisitos detalhados

---

**Frontend Angular 18 + BFF Flask Integration**
