# spec-fe-004.md

# FE-004 - Revisão de Transações Extraídas

## Objetivo

Permitir que o usuário revise, corrija e valide as transações extraídas automaticamente de uma fatura antes da persistência definitiva dos dados.

## Problema

O OCR e o processo de extração podem gerar inconsistências. O usuário deve possuir uma etapa intermediária para validar as informações.

## Escopo

### Incluído
- Visualização das transações extraídas
- Edição de descrição
- Edição de categoria
- Edição de valor
- Remoção de transações inválidas
- Confirmação da importação

### Não Incluído
- OCR
- Upload de arquivo
- Relatórios

## Requisitos Funcionais

### RF-001
Listar todas as transações extraídas.

### RF-002
Permitir editar uma transação.

### RF-003
Permitir alterar categoria.

### RF-004
Permitir remover uma transação.

### RF-005
Permitir confirmar a importação.

### RF-006
Permitir cancelar a importação.

## Critérios de Aceitação

- Usuário consegue editar qualquer registro extraído.
- Usuário consegue remover registros inválidos.
- Confirmação envia somente registros aprovados.
