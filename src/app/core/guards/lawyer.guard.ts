import { CanActivateFn } from '@angular/router';

export const lawyerGuard: CanActivateFn = (route, state) => {
  return true;
};
