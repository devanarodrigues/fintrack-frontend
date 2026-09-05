# plan-fe-006.md

# FE-006 - Visão por Cartão

## Estrutura

Tabela Financeira - {Nome do Cartão}

| Data | Categoria | Descrição | Valor |

## Componentes

- CardSelector
- CardSummary
- CardExpensesTable
- FiltersPanel
- SearchBar

## Fluxograma

```mermaid
flowchart TD
A[Acessar Visão por Cartão]
--> B[Selecionar Cartão]
--> C[Carregar Transações]

C --> D[Exibir Indicadores]
C --> E[Exibir Tabela]

E --> F[Filtrar]
E --> G[Pesquisar]
E --> H[Ordenar]

F --> I[Atualizar Resultado]
G --> I
H --> I
```
