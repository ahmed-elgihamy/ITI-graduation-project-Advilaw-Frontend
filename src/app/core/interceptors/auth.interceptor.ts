// src/app/core/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { env } from '../env/env';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  // Skip interception for certain requests
  if (shouldSkipInterceptor(req)) {
    return next(req);
  }

  // const token = authService.getToken();
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return next(cloned);
  }

  return next(req);
};

function shouldSkipInterceptor(req: HttpRequest<unknown>): boolean {
  // Skip for authentication requests
  if (req.url.includes('/auth/')) {
    return true;
  }

  // Skip for public APIs
  if (req.url.includes('/public/')) {
    return true;
  }

  // Skip for external URLs (non-API calls)
  if (!req.url.startsWith(env.baseUrl)) {
    return true;
  }

  return false;
}
