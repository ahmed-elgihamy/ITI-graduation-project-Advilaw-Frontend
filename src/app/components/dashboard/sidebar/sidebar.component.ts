import { CommonModule, NgStyle } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItemComponent } from '../tools/nav-item/nav-item.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgStyle, CommonModule, NavItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isOpendsidebar = signal(true);
  isAdmin = false;
  profileLink: string = '';
  profileLabel: string = '';
  // profileLink: string = '/dashboard/profile';
  // profileLabel: string = 'Profile';
  isProfileAdded: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    const user = this.authService.getUserInfo();
    if (user?.role === 'Admin' || user?.role === 'SuperAdmin') {
      this.profileLink = '/dashboard/admin-dashboard/admin/profile';
      this.profileLabel = 'Admin Profile';
      this.isProfileAdded = true;
    }
    // else if (user?.role === 'Lawyer') {
    //   this.profileLink = '/dashboard/lawyer/profile';
    //   this.profileLabel = 'Lawyer Profile';
    // }
    else if (user?.role === 'Client') {
      this.profileLink = '/dashboard/client/profile';
      this.profileLabel = 'Client Profile';
      this.isProfileAdded = true;
    }
  }

  isLawyer(): boolean {
    const user = this.authService.getUserInfo();
    return user?.role === 'Lawyer';
  }

  toggleSidebar() {
    this.isOpendsidebar.set(!this.isOpendsidebar());
  }
}
