// pages/login/login.page.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LoginCredentials, User } from '../../shared/interfaces/app.interfaces';
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
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private destroy$ = new Subject<void>();

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.checkExistingSession();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(VALIDATION_PATTERNS.EMAIL)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }

  private initializeSubscriptions(): void {
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user?.isAuthenticated) {
          this.navigateToNextPage();
        }
      });
  }

  private checkExistingSession(): void {
    if (this.authService.isAuthenticated()) {
      this.navigateToNextPage();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const credentials: LoginCredentials = this.loginForm.value;
      
      this.authService.login(credentials)
        .pipe(takeUntil(this.destroy$))
        .subscribe(async response => {
          if (response.success) {
            await this.showSuccessToast(response.message || 'Login successful');
            this.navigateToNextPage();
          } else {
            await this.showErrorAlert(response.error || 'Login failed');
          }
        });
    } else {
      await this.showValidationErrors();
    }
  }

  onTogglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(): void {
    // Navigate to forgot password or show modal
    console.log('Forgot password clicked');
  }

  onCreateAccount(): void {
    // Navigate to registration page
    console.log('Create account clicked');
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return 'Password must be at least 6 characters';
      }
    }
    return '';
  }

  private navigateToNextPage(): void {
    this.router.navigate([`/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.FEATURES}`]);
  }

  private async showSuccessToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  private async showErrorAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Login Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showValidationErrors(): Promise<void> {
    const errors = Object.keys(this.loginForm.controls)
      .filter(key => this.isFieldInvalid(key))
      .map(key => this.getFieldError(key))
      .join('\\n');

    if (errors) {
      const alert = await this.alertController.create({
        header: 'Validation Errors',
        message: errors,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}