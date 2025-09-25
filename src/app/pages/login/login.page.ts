//login.page.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LoginCredentials } from '../../shared/interfaces/app.interfaces';
import { VALIDATION_PATTERNS } from '../../shared/constants/app.constants';
import { ROUTE_PATHS } from 'src/app/app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly formBuilder = inject(FormBuilder);
  
  loginForm: FormGroup = this.createLoginForm();
  isLoading = false;
  showPassword = false;

  ngOnInit(): void {
    // console.log('isLoading on init:', this.isLoading);
    this.subscribeToAuthState();
    this.redirectIfAuthenticated();
  }
// testClick(): void {
//   console.log('Button clicked');
// }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(VALIDATION_PATTERNS.EMAIL)],
        updateOn: 'blur'
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'blur'
      }),
      rememberMe: [false]
    });
  }

  private subscribeToAuthState(): void {
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user?.isAuthenticated) this.navigateToDashboard();
      });
  }

  private redirectIfAuthenticated(): void {
    if (this.authService.isAuthenticated()) this.navigateToDashboard();
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading || !this.loginForm.valid) return;
    this.isLoading = true;
    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async response => {
        this.isLoading = false;
        if (response.success) {
          await this.showToast(response.message || 'Login successful', 'success');
          this.navigateToDashboard();
          // this.router.navigate([`/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.FEATURES}`]); //ensures Login handled outside the tabbed dashboard & Dashboard only loads after authentication
        } else {
          await this.showAlert('Login Error', response.error || 'Login failed');
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
  }

  onCreateAccount(): void {
    console.log('Create account clicked');
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['pattern']) return 'Please enter a valid email address';
    if (field.errors['minlength']) return 'Password must be at least 6 characters';

    return '';
  }

  private navigateToDashboard(): void {
    this.router.navigate([`/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.FEATURES}`]);
  }

  private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
      buttons: [{ text: 'Dismiss', role: 'cancel' }]
    });
    await toast.present();
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showValidationErrors(): Promise<void> {
    const errors = Object.keys(this.loginForm.controls)
      .filter(key => this.isFieldInvalid(key))
      .map(key => this.getFieldError(key))
      .join('\n');

    if (errors) await this.showAlert('Validation Errors', errors);
  }
}