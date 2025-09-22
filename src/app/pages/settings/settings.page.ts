// pages/settings/settings.page.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User, AppSettings } from '../../shared/interfaces/app.interfaces';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  settings: AppSettings = {
    theme: 'auto',
    notifications: true,
    language: 'en'
  };

  themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'System Default' }
  ];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' }
  ];

/**
 * Initialize subscriptions and load settings on component initialization.
 */
  ngOnInit(): void {
    this.initializeSubscriptions();
    this.loadSettings();
  }

/**
 * Clean up subscriptions and complete the destruction subject on component destruction.
 */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

/**
 * Initializes subscriptions to the user subject and loads the user data
 * when the subscription is active. This is done by piping the user subject
 * to take until the destruction subject is completed, and then subscribing
 * to the resulting observable. When the subscription is active, the user data
 * is stored in the component's `currentUser` property.
 */
  private initializeSubscriptions(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  /**
   * Loads the application settings from storage or an API.
   * If the settings are found in storage, they are parsed and merged
   * with the default settings. If an error occurs during parsing,
   * the error is logged to the console.
   */
  private loadSettings(): void {
    // Load settings from storage or API
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }

/**
 * Handles theme change events by updating the application settings
 * and applying the selected theme to the application.
 *
 * @param event - The theme change event
 */
  onThemeChange(event: any): void {
    this.settings.theme = event.detail.value;
    this.saveSettings();
    this.applyTheme(this.settings.theme);
  }

/**
 * Handles notification toggle events by updating the application settings
 * and displaying a toast message with the updated notification status.
 *
 * @param event - The notification toggle event
 */
  onNotificationsToggle(event: any): void {
    this.settings.notifications = event.detail.checked;
    this.saveSettings();
    this.showToast(
      `Notifications ${this.settings.notifications ? 'enabled' : 'disabled'}`
    );
  }

/**
 * Handles language change events by updating the application settings
 * and displaying a toast message with the updated language preference.
 *
 * @param event - The language change event
 */
  onLanguageChange(event: any): void {
    this.settings.language = event.detail.value;
    this.saveSettings();
    this.showToast('Language preference updated');
  }

/**
 * Prompts the user to confirm logout and logs them out if confirmed.
 *
 * Presents an alert with a confirmation button and a cancel button.
 * If the user clicks the confirmation button, the user is logged out using the
 * AuthService logout method. The logout method is subscribed to until the component
 * is destroyed to prevent memory leaks.
 *
 * @returns A promise that resolves when the user is logged out or the alert is dismissed.
 */
  async onLogout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          role: 'confirm',
          handler: () => {
            this.authService.logout()
              .pipe(takeUntil(this.destroy$))
              .subscribe();
          }
        }
      ]
    });

    await alert.present();
  }

  async onClearData(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Clear All Data',
      message: 'This will remove all your local data. This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear Data',
          role: 'confirm',
          handler: () => {
            this.clearAllData();
          }
        }
      ]
    });

    await alert.present();
  }

/**
 * Triggers the data export feature, which will allow users to download
 * their local data as a backup. This feature is currently under development.
 */
  onExportData(): void {
    // Implement data export functionality
    this.showToast('Data export feature coming soon!');
  }

  /**
   * Opens the default email client with a pre-filled email to the support team.
   * The email will have the subject "ItemBoss Support Request" and the body "Hello, I need help with...".
   * The user can then fill in the email with their support request and send it to the support team.
   */
  onContactSupport(): void {
    // Open email or support page
    const subject = encodeURIComponent('ItemBoss Support Request');
    const body = encodeURIComponent('Hello, I need help with...');
    const mailto = `mailto:support@itemboss.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailto;
  }

  /**
   * Saves the current application settings to local storage.
   * If an error occurs while saving the settings, it will be logged to the console.
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('app_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Applies the given theme to the document body.
   * If the theme is "dark", the document body will have the "dark" class added.
   * If the theme is "auto", the document body will have the "dark" class added if the user's system prefers a dark color scheme.
   * @param theme The theme to apply, either "dark", "light", or "auto".
   */
  private applyTheme(theme: string): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    document.body.classList.remove('dark');
    
    if (theme === 'dark' || (theme === 'auto' && prefersDark.matches)) {
      document.body.classList.add('dark');
    }
  }

  /**
   * Clears all local data and resets the application settings to their defaults.
   * This method is called when the user triggers the "Clear Local Data" feature.
   * It clears both local storage and session storage, and resets the application settings
   * to their default values.
   * If an error occurs while clearing the data, it will be logged to the console and a toast
   * will be shown with the message "Error clearing data".
   */
  private clearAllData(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
      this.showToast('All local data cleared');
      
      // Reset settings to defaults
      this.settings = {
        theme: 'auto',
        notifications: true,
        language: 'en'
      };
    } catch (error) {
      console.error('Error clearing data:', error);
      this.showToast('Error clearing data');
    }
  }

  /**
   * Shows a toast notification with the given message.
   * The toast will appear at the bottom of the screen and will be shown for 2 seconds.
   * @param message The message to show in the toast notification.
   * @returns A promise that resolves when the toast has been shown.
   */
  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}