// pages/features/features.page.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/app.interfaces';
import { FilterPipe } from '../../shared/pipes/filter.pipe';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isEnabled: boolean;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [IonicModule, CommonModule, FilterPipe],
  templateUrl: 'features.page.html',
  styleUrls: ['features.page.scss'],
})
export class FeaturesPage implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  features: FeatureItem[] = [
    {
      id: 'inventory',
      title: 'Inventory Management',
      description: 'Track and manage your items efficiently',
      icon: 'cube-outline',
      color: 'primary',
      isEnabled: true
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'Get insights into your inventory trends',
      icon: 'analytics-outline',
      color: 'success',
      isEnabled: true
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      description: 'Stay updated with real-time alerts',
      icon: 'notifications-outline',
      color: 'warning',
      isEnabled: false
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Work together with your team members',
      icon: 'people-outline',
      color: 'secondary',
      isEnabled: false
    },
    {
      id: 'export',
      title: 'Data Export',
      description: 'Export your data in various formats',
      icon: 'download-outline',
      color: 'tertiary',
      isEnabled: true
    },
    {
      id: 'security',
      title: 'Advanced Security',
      description: 'Keep your data safe and secure',
      icon: 'shield-checkmark-outline',
      color: 'danger',
      isEnabled: true
    }
  ];

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSubscriptions(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  onFeatureClick(feature: FeatureItem): void {
    if (feature.isEnabled) {
      console.log(`Opening feature: ${feature.title}`);
      // Navigate to specific feature or show feature details
    } else {
      console.log(`Feature ${feature.title} is coming soon!`);
      // Show coming soon message
    }
  }

  onLogout(): void {
    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('User logged out successfully');
      });
  }

  trackByFeatureId(index: number, feature: FeatureItem): string {
    return feature.id;
  }

  getEnabledFeaturesCount(): number {
    return this.features.filter(feature => feature.isEnabled).length;
  }
}