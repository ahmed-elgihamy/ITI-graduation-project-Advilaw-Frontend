import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/dashboard/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dashboard-layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {}
