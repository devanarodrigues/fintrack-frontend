# plan-fe-007.md

# FE-007 - Gerar Relatórios

## Componentes

- ReportFilters
- ReportPreview
- ReportSummary
- ExportPdfButton

## Fluxograma

```mermaid
flowchart TD
A[Acessar Relatórios]
--> B[Selecionar Período]

B --> C[Carregar Dados]

C --> D[Gerar Resumo]
C --> E[Gerar Categorias]
C --> F[Gerar Cartões]

D --> G[Pré-Visualização]
E --> G
F --> G

G --> H[Gerar PDF]
H --> I[Download]
```

## Conteúdo do Relatório

- Resumo Financeiro
- Total Gasto
- Gastos por Categoria
- Gastos por Cartão
- Parcelas Futuras
- Despesas Fixas
