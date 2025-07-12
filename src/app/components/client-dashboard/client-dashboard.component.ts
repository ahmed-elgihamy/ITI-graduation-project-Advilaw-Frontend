import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css',
  imports: [RouterModule, CommonModule],
})
export class ClientDashboardComponent {
  links = document.querySelectorAll('#sidebarMenuOffcanvas .nav-link');
  closeNavbar(): void {
    (
      document.querySelector(
        '.offcanvas-header .btn-close'
      ) as HTMLButtonElement
    )?.click();
  }
}
