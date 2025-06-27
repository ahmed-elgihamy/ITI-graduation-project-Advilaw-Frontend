import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // const isLoggedIn = authService.isLoggedIn();
  // const url = state.url;

  // if (isLoggedIn && ['/login', '/register', '/register-lawyer'].includes(url)) {
  //   router.navigate(['/home']);
  //   return false;
  // }

  // if (!isLoggedIn && url.startsWith('/dashboard')) {
  //   router.navigate(['/login']);
  //   return false;
  // }

  return true;
};
