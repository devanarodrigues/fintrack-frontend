// Angular 18 — SPA Routes
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'FinTrack — Dashboard'
  },
  {
    path: 'gastos',
    loadComponent: () =>
      import('./features/expenses/expenses.component').then(m => m.ExpensesComponent),
    title: 'FinTrack — Gerenciar Gastos'
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./features/upload/upload.component').then(m => m.UploadComponent),
    title: 'FinTrack — Upload de Fatura'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
