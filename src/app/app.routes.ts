// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginPage } from './pages/login/login.page';

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
    path: '',
    redirectTo: ROUTE_PATHS.LOGIN,
    pathMatch: 'full'
  },
  {
    path: ROUTE_PATHS.LOGIN,
    component: LoginPage
  },
  {
    path: ROUTE_PATHS.DASHBOARD,
    component: DashboardPage,
    children: [
      {
        path: ROUTE_PATHS.FEATURES,
        loadComponent: () =>
          import('./pages/features/features.page').then(m => m.FeaturesPage)
      },
      {
        path: ROUTE_PATHS.SETTINGS,
        loadComponent: () =>
          import('./pages/settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: '',
        redirectTo: ROUTE_PATHS.FEATURES,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ROUTE_PATHS.LOGIN
  }
];