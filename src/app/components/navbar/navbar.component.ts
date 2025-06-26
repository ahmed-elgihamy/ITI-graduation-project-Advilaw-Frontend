import { AuthService } from './../../core/services/auth.service';
import { Component } from '@angular/core';
import { LawyerOrClientModalComponent } from '../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [LawyerOrClientModalComponent, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
