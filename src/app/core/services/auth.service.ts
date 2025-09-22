// core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginCredentials, ApiResponse } from '../../shared/interfaces/app.interfaces';
import { STORAGE_KEYS, APP_CONFIG } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  
  private userSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  
  public user$ = this.userSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initializes the authentication state of the application.
   * Checks if the stored user object and token are valid, and if so,
   * sets the user subject to the stored user object.
   */
  private initializeAuth(): void {
    const storedUser = this.getStoredUser();
    if (storedUser && this.isTokenValid()) {
      this.userSubject.next(storedUser);
    }
  }

  /**
   * Simulates a login request to the backend API.
   * @param credentials - The email and password to authenticate with.
   * @returns An observable that emits a successful login response with the user data
   * if the credentials are valid, or an error response if they are not.
   */
  login(credentials: LoginCredentials): Observable<ApiResponse<User>> {
    this.isLoadingSubject.next(true);
    
    // Simulate API call
    return of(null).pipe(
      delay(1500), // Simulate network delay
      map(() => {
        // Mock authentication logic
        if (this.validateCredentials(credentials)) {
          const user: User = {
            id: '1',
            email: credentials.email,
            username: credentials.email.split('@')[0],
            isAuthenticated: true,
            lastLogin: new Date()
          };
          
          this.setUserSession(user, credentials.rememberMe);
          this.userSubject.next(user);
          
          return {
            success: true,
            data: user,
            message: 'Login successful'
          };
        } else {
          return {
            success: false,
            error: 'Invalid credentials'
          };
        }
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Logs the user out of the application by clearing their session data
   * and redirecting them to the login page.
   *
   * @returns An observable that emits a successful logout response.
   */
  logout(): Observable<ApiResponse> {
    return of(null).pipe(
      delay(500),
      tap(() => {
        this.clearUserSession();
        this.userSubject.next(null);
        this.router.navigate(['/dashboard/login']);
      }),
      map(() => ({
        success: true,
        message: 'Logged out successfully'
      }))
    );
  }

/**
 * Checks if the user is authenticated or not.
 * Returns true if the user is authenticated, false otherwise.
 * If there is no user data available, returns false.
 */
  isAuthenticated(): boolean {
    const user = this.userSubject.value;
    return user?.isAuthenticated ?? false;
  }

/**
 * Returns the current user object if the user is authenticated, null otherwise.
 * The user object contains the user's authentication status, email, and name.
 */
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Validates the provided login credentials.
   * Returns true if the credentials are valid, false otherwise.
   * In this mock implementation, the credentials are considered valid if the email
   * contains an '@' symbol and the password is at least 6 characters long.
   * In a real application, this validation would be handled by the backend.
   * @param {LoginCredentials} credentials - The login credentials to validate.
   * @returns {boolean} - True if the credentials are valid, false otherwise.
   */
  private validateCredentials(credentials: LoginCredentials): boolean {
    // Mock validation - in real app, this would be handled by backend
    return credentials.email.includes('@') && credentials.password.length >= 6;
  }

  /**
   * Sets the user session data and token in local or session storage
   * depending on whether the user chose to remember their login credentials.
   * If rememberMe is true, the user data and token are stored in local storage.
   * Otherwise, the user data and token are stored in session storage.
   * @param user - The user object to store in the session.
   * @param rememberMe - Whether to store the user data and token in local storage (true) or session storage (false).
   */
  private setUserSession(user: User, rememberMe?: boolean): void {
    const userData = JSON.stringify(user);
    const token = this.generateMockToken();
    
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    } else {
      sessionStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
      sessionStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    }
  }

  /**
   * Clears the user session data and token from local and session storage.
   * This method is called when the user logs out or when the user session expires.
   */
  private clearUserSession(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  }

  /**
   * Retrieves the stored user object from local or session storage.
   * If the stored user data is invalid or missing, returns null.
   * @returns The stored user object, or null if the stored data is invalid or missing.
   */
  private getStoredUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA) ||
                    sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    try {
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Checks if the stored user token is valid.
   * Returns true if the token is valid, false otherwise.
   * In a real application, this validation would be handled by the backend.
   * @returns {boolean} - True if the token is valid, false otherwise.
   */
  private isTokenValid(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN) ||
                 sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    
    // In a real app, validate token with backend
    return !!token;
  }

  /**
   * Generates a mock token based on the current timestamp and a random number.
   * In a real application, this token would be generated by the backend.
   * @returns A mock token string.
   */
  private generateMockToken(): string {
    return btoa(`${Date.now()}-${Math.random()}`);
  }
}