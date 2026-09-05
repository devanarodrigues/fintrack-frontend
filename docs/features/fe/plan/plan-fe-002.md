# FE-002 - Gerenciar Gastos

## Visão Técnica

Tela central para manutenção dos lançamentos financeiros.

## Fluxograma

```mermaid
flowchart TD
A[Gerenciar]
--> B[Novo Gasto]
--> C[Salvar]

A --> D[Upload PDF]
--> E[Enviar Arquivo]

A --> F[Listar Gastos]
F --> G[Editar]
F --> H[Excluir]
```

## Componentes

- ExpenseForm
- ExpenseTable
- UploadInvoice
- ConfirmationModal
