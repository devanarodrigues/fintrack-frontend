# plan-fe-008.md

# FE-008 - Linha do Tempo

## Componentes

- TimelineChart
- TimelineFilters
- SummaryCards
- DateRangeSelector

## Fluxograma

```mermaid
flowchart TD
A[Acessar Linha do Tempo]
--> B[Carregar Dados]
--> C[Renderizar Gráfico]

C --> D[Filtrar Categoria]
C --> E[Filtrar Cartão]
C --> F[Filtrar Tipo]
C --> G[Filtrar Período]

D --> H[Atualizar Gráfico]
E --> H
F --> H
G --> H
```

## Métricas

- Valor Total
- Média Mensal
- Gastos por Categoria
- Gastos por Cartão
