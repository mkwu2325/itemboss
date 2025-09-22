// shared/constants/app.constants.ts
import { TabItem } from '../interfaces/app.interfaces';

export const APP_CONFIG = {
  APP_NAME: 'ItemBoss',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  REMEMBER_ME: 'remember_me',
} as const;

export const NAVIGATION_TABS: TabItem[] = [
  {
    id: 'login',
    title: 'Login',
    icon: 'log-in-outline',
    route: '/dashboard/login',
    isActive: true
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings-outline',
    route: '/dashboard/settings',
    isActive: false
  },
  {
    id: 'features',
    title: 'Features',
    icon: 'apps-outline',
    route: '/dashboard/features',
    isActive: false
  }
];

export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;