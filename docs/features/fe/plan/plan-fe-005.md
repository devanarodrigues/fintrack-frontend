# plan-fe-005.md

# FE-005 - Visualizar Planilha

## Estrutura

Data | Cartão | Categoria | Descrição | Valor

## Componentes

- ExpensesTable
- TableFilters
- SearchBar
- Pagination

## Fluxograma

```mermaid
flowchart TD
A[Acessar Planilha]
--> B[Carregar Gastos]
--> C[Exibir Tabela]

C --> D[Aplicar Filtros]
C --> E[Pesquisar]
C --> F[Ordenar]

D --> G[Atualizar Resultado]
E --> G
F --> G
```
