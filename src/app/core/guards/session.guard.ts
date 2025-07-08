import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class SessionGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) { }

  canActivate(): boolean {
    if (!this.session.sessionEnded() && this.session.timeLeft() > 0) {
      return true;
    } else {
      this.router.navigate(['/not-allowed']);
      return false;
    }
  }
}
