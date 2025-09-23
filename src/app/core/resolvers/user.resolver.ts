// core/resolvers/user.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../../shared/interfaces/app.interfaces';

export const userResolver: ResolveFn<User | null> = (route, state) => {
  const authService = inject(AuthService);

  return authService.user$.pipe(
    map(user => user),
    catchError(error => {
      console.error('Error resolving user data:', error);
      return of(null);
    })
  );
};