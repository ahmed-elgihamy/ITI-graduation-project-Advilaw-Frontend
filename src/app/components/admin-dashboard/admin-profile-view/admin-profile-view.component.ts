import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-admin-profile-view',
  imports: [CommonModule,RouterModule],
  templateUrl: './admin-profile-view.component.html',
  styleUrl: './admin-profile-view.component.css'
})
export class AdminProfileViewComponent implements OnInit {
  profile: any = null;
  isLoading = false;
  errorMsg = '';
  profileImageUrl = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.isLoading = true;
    this.adminService.getAdminProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileImageUrl = profile.imageUrl || 'assets/default-profile.png';
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load profile.';
        this.isLoading = false;
      }
    });
  }
}
