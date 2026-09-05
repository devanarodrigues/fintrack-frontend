# FE-001 - Home Dashboard

## Visão Técnica

A Home será o ponto de entrada da aplicação contendo Header, Menu e Cards de indicadores financeiros.

## Fluxograma

```mermaid
flowchart TD
A[Usuário acessa Home]
--> B[Solicitar dados financeiros]
--> C[Receber dados]
--> D[Calcular indicadores]
--> E[Renderizar Dashboard]
```

## Componentes

- Header
- NavigationDrawer
- DashboardGrid
- DashboardCard
