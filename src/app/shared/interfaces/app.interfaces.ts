// shared/interfaces/app.interfaces.ts
export interface User {
  id: string;
  email: string;
  username: string;
  isAuthenticated: boolean;
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
}

export interface TabItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}