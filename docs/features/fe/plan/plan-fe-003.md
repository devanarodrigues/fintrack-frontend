# FE-003 - Upload de Faturas

## Visão Técnica

Tela responsável pelo envio de faturas para processamento no backend.

## Fluxograma

```mermaid
flowchart TD
A[Selecionar PDF]
--> B[Validar Arquivo]

B -->|Válido| C[Enviar para API]
B -->|Inválido| D[Exibir Erro]

C --> E[Processando]
E --> F[Concluído]
E --> G[Falha]
```

## Componentes

- UploadArea
- UploadButton
- ProgressIndicator
- ErrorMessage
