// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';

// Route constants for better maintainability
export const ROUTE_PATHS = {
  EMPTY: '',
  DASHBOARD: 'dashboard',
  LOGIN: 'login',
  SETTINGS: 'settings',
  FEATURES: 'features'
} as const;

export const routes: Routes = [
  {
    path: ROUTE_PATHS.EMPTY,
    redirectTo: `/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.LOGIN}`,
    pathMatch: 'full'
  },
  {
    path: ROUTE_PATHS.DASHBOARD,
    component: DashboardPage,
    children: [
      {
        path: ROUTE_PATHS.LOGIN,
        loadComponent: () =>
          import('./pages/login/login.page').then(m => m.LoginPage)
      },
      {
        path: ROUTE_PATHS.SETTINGS,
        loadComponent: () =>
          import('./pages/settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: ROUTE_PATHS.FEATURES,
        loadComponent: () =>
          import('./pages/features/features.page').then(m => m.FeaturesPage)
      },
      {
        path: ROUTE_PATHS.EMPTY,
        redirectTo: ROUTE_PATHS.LOGIN,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: `/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.LOGIN}`
  }
];
