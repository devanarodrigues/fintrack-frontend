# plan-fe-004.md

# FE-004 - Revisão de Transações Extraídas

## Componentes

- ReviewTable
- TransactionRow
- CategorySelector
- SaveReviewButton
- CancelReviewButton

## Fluxograma

```mermaid
flowchart TD
A[Fatura Processada]
--> B[Exibir Transações]

B --> C[Editar Registro]
B --> D[Excluir Registro]
B --> E[Alterar Categoria]

C --> F[Atualizar Lista]
D --> F
E --> F

F --> G{Confirmar Importação?}

G -->|Sim| H[Salvar Transações]
G -->|Não| I[Cancelar Processo]
```

## Estados

- Loading
- Success
- Error
- Empty

## Responsividade

- Mobile: tabela com scroll horizontal
- Desktop: tabela completa
