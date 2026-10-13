import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ...['dashboard', 'approvals', 'identify', 'person', 'delivery', 'summary', 'success', 'catalog', 'order', 'packages', 'arrived', 'transit', 'low', 'sites', 'expiry']
    .map((path) => ({ path, loadComponent: () => import('./app').then((m) => m.App) })),
  { path: '**', redirectTo: 'dashboard' },
];
