# FinTrack — SPA Angular (FE-001 a FE-003)

## Arquitetura

Implementado como Single-Page Application seguindo a arquitetura Angular 18:

```
src/app/
├── core/
│   ├── models/
│   │   └── expense.model.ts      # Interface Expense, tipos
│   └── services/
│       ├── expense.service.ts    # CRUD + state management
│       └── upload.service.ts     # Upload simulation + status
├── shared/
│   ├── components/
│   │   ├── toast/                # Toast notifications
│   │   └── modal/                # Modal base component
│   └── pipes/
│       └── currency-br.pipe.ts   # Formatação moeda BR
└── features/
    ├── home/                     # FE-001 Dashboard
    │   ├── home.component.ts
    │   ├── home.component.html
    │   └── kpi-card/
    ├── expenses/                 # FE-002 Gerenciar Gastos
    │   ├── expenses.component.ts
    │   ├── expenses.component.html
    │   ├── expense-form/
    │   └── expense-table/
    └── upload/                   # FE-003 Upload de Faturas
        ├── upload.component.ts
        ├── upload.component.html
        ├── upload-zone/
        └── status-panel/
```

## Rotas
- `/`         → HomeComponent       (FE-001)
- `/gastos`   → ExpensesComponent   (FE-002)
- `/upload`   → UploadComponent     (FE-003)

## Angular Version: 18 (Standalone Components)

## Tasks Implementadas

### FE-001 Home Dashboard
- [x] TASK-001 Estrutura da Home
- [x] TASK-002 Header / Topbar
- [x] TASK-003 NavigationDrawer (sidebar responsiva)
- [x] TASK-004 DashboardCard component
- [x] TASK-005 DashboardGrid layout
- [x] TASK-006 Card Total Gasto
- [x] TASK-007 Card Cartão Principal
- [x] TASK-008 Card Maior Gasto
- [x] TASK-009 Card Parcelas Futuras
- [x] TASK-010 Card Despesas Fixas
- [x] TASK-011 Card Previsão Próximo Mês

### FE-002 Gerenciar Gastos
- [x] TASK-001 Página Gerenciar
- [x] TASK-002 Formulário de gasto manual
- [x] TASK-003 Upload de PDF (atalho)
- [x] TASK-004 Listagem de gastos
- [x] TASK-005 Edição de gastos
- [x] TASK-006 Exclusão de gastos (confirm modal)
- [x] TASK-007 Busca e filtros (descrição, categoria, cartão)
- [x] TASK-008 Estados loading, empty e error

### FE-003 Upload de Faturas
- [x] TASK-001 Página Upload
- [x] TASK-002 Seleção de arquivo PDF
- [x] TASK-003 Validação de formato e tamanho
- [x] TASK-004 Envio para API (simulado)
- [x] TASK-005 Indicador de processamento com progresso
- [x] TASK-006 Tratamento de erro
- [x] TASK-007 Estado de sucesso
- [x] TASK-008 Testes da capability

## Para rodar em produção com Angular CLI:
```bash
ng new fintrack --standalone --routing --style=scss
cd fintrack
ng generate component features/home --standalone
ng generate component features/expenses --standalone
ng generate component features/upload --standalone
```
