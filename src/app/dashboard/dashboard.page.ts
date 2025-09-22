import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NavigationService } from '../core/services/navigation.service';
import { AuthService } from '../core/services/auth.service';
import { TabItem, User } from '../shared/interfaces/app.interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  tabs: TabItem[] = [];
  currentUser: User | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSubscriptions(): void {
    // Subscribe to navigation tabs
    this.navigationService.tabs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tabs => {
        this.tabs = tabs;
      });

    // Subscribe to current user
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Subscribe to loading state
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  onTabClick(tabId: string): void {
    this.navigationService.navigateToTab(tabId);
  }

  trackByTabId(index: number, tab: TabItem): string {
    return tab.id;
  }
}
