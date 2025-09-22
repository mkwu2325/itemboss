// core/services/navigation.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TabItem } from '../../shared/interfaces/app.interfaces';
import { NAVIGATION_TABS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);
  
  private tabsSubject = new BehaviorSubject<TabItem[]>(NAVIGATION_TABS);
  private currentTabSubject = new BehaviorSubject<string>('login');
  
  public tabs$ = this.tabsSubject.asObservable();
  public currentTab$ = this.currentTabSubject.asObservable();
  
  constructor() {
    this.initializeNavigation();
  }

  /**
   * Initializes navigation by listening to route changes and updating the active tab.
   * When the route changes, it updates the active tab by calling updateActiveTab.
   */
  private initializeNavigation(): void {
    // Listen to route changes and update active tab
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ).subscribe(url => {
      this.updateActiveTab(url);
    });
  }

  /**
   * Navigate to the tab with the given ID.
   * If the tab is found, it will navigate to the tab's route and set the tab as active.
   * @param tabId The ID of the tab to navigate to.
   */
  navigateToTab(tabId: string): void {
    const tab = this.findTabById(tabId);
    if (tab) {
      this.router.navigate([tab.route]);
      this.setActiveTab(tabId);
    }
  }

  /**
   * Sets the active tab to the given tab ID.
   * It updates the tabs subject with the new active tab and also updates the current tab subject.
   * @param tabId The ID of the tab to set as active.
   */
  setActiveTab(tabId: string): void {
    const updatedTabs = this.tabsSubject.value.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    }));
    
    this.tabsSubject.next(updatedTabs);
    this.currentTabSubject.next(tabId);
  }

  /**
   * Returns the currently active tab or null if no active tab is found.
   * @return The currently active tab or null.
   */
  getActiveTab(): TabItem | null {
    return this.tabsSubject.value.find(tab => tab.isActive) || null;
  }

  /**
   * Returns the current tabs as an array of TabItem objects.
   * The tabs array includes all tabs, including the active tab.
   * @return The current tabs as an array of TabItem objects.
   */
  getTabs(): TabItem[] {
    return this.tabsSubject.value;
  }

  /**
   * Updates the active tab by finding the tab that matches the given URL.
   * It will set the active tab to the matched tab's ID.
   * @param url The URL to find the matching tab for.
   */
  private updateActiveTab(url: string): void {
    const activeTab = this.tabsSubject.value.find(tab => 
      url.includes(tab.route) || url.includes(tab.id)
    );
    
    if (activeTab) {
      this.setActiveTab(activeTab.id);
    }
  }

  /**
   * Finds a tab by its ID.
   * @param tabId The ID of the tab to find.
   * @return The tab with the given ID if found, or null otherwise.
   */
  private findTabById(tabId: string): TabItem | null {
    return this.tabsSubject.value.find(tab => tab.id === tabId) || null;
  }

  // Method to dynamically add tabs if needed
  addTab(tab: TabItem): void {
    const currentTabs = this.tabsSubject.value;
    const tabExists = currentTabs.some(existingTab => existingTab.id === tab.id);
    
    if (!tabExists) {
      this.tabsSubject.next([...currentTabs, tab]);
    }
  }

  // Method to remove tabs if needed
  removeTab(tabId: string): void {
    const updatedTabs = this.tabsSubject.value.filter(tab => tab.id !== tabId);
    this.tabsSubject.next(updatedTabs);
  }
}