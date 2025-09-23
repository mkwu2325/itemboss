// core/services/route-data.service.ts
import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface RouteData {
  title?: string;
  breadcrumbs?: string[];
  showBackButton?: boolean;
  headerActions?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RouteDataService {
  private readonly router = inject(Router);
  
  private routeDataSubject = new BehaviorSubject<RouteData>({});
  private currentRouteSubject = new BehaviorSubject<string>('');
  
  public routeData$ = this.routeDataSubject.asObservable();
  public currentRoute$ = this.currentRouteSubject.asObservable();

  constructor() {
    this.initializeRouteTracking();
  }

  private initializeRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ).subscribe(url => {
      this.currentRouteSubject.next(url);
      this.updateRouteData(url);
    });
  }

  private updateRouteData(url: string): void {
    const routeData: RouteData = this.getRouteDataForUrl(url);
    this.routeDataSubject.next(routeData);
  }

  private getRouteDataForUrl(url: string): RouteData {
    // Define route-specific data
    const routeConfigs: { [key: string]: RouteData } = {
      '/dashboard/login': {
        title: 'Sign In',
        breadcrumbs: ['Home', 'Sign In'],
        showBackButton: false
      },
      '/dashboard/features': {
        title: 'Features',
        breadcrumbs: ['Home', 'Features'],
        showBackButton: false,
        headerActions: [
          { icon: 'log-out-outline', action: 'logout', color: 'medium' }
        ]
      },
      '/dashboard/settings': {
        title: 'Settings',
        breadcrumbs: ['Home', 'Settings'],
        showBackButton: false
      }
    };

    // Find matching route config
    const matchingRoute = Object.keys(routeConfigs).find(route => 
      url.includes(route)
    );

    return matchingRoute ? routeConfigs[matchingRoute] : { title: 'ItemBoss' };
  }

  setRouteData(data: RouteData): void {
    this.routeDataSubject.next({ ...this.routeDataSubject.value, ...data });
  }

  getRouteData(): RouteData {
    return this.routeDataSubject.value;
  }
}