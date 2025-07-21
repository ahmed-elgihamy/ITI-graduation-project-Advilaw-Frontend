import { AuthService } from './../../core/services/auth.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LawyerOrClientModalComponent } from '../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../types/UserInfo';
import { ClientService } from '../../core/services/client.service';
import { LawyerService } from '../../core/services/lawyer.service';

@Component({
  selector: 'app-navbar',
  imports: [
    LawyerOrClientModalComponent,
    RouterModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], // Corrected property name
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLogged: boolean = false;
  private sub!: Subscription;
  userInfo: UserInfo | null = null;
  profileImageUrl: string = 'assets/images/male.jpg';

  constructor(
    public _auth: AuthService,
    public router: Router,
    private clientService: ClientService,
    private lawyerService: LawyerService
  ) { }

  ngOnInit(): void {
    this.sub = this._auth.isLoggedIn$.subscribe((res) => {
      this.isLogged = res;
      this.userInfo = this._auth.getUserInfo();
      this.loadProfileImage();
    });
  }
  notifications = [
    { title: 'New message from Lawyer Ahmed', timeAgo: '2 mins ago' },
    { title: 'Job #123 status updated', timeAgo: '1 hour ago' },
    // Add more dummy or API data here
  ];

  get hasNotifications(): boolean {
    return this.notifications.length > 0;
  }

  loadProfileImage() {
    if (this.userInfo) {
      if (this.userInfo.role === 'Client') {
        this.clientService.getClientProfile().subscribe({
          next: (response) => {
            this.profileImageUrl = response.data?.imageUrl
              ? (response.data.imageUrl.startsWith('http') ? response.data.imageUrl : 'https://localhost:44302' + response.data.imageUrl)
              : 'assets/images/male.jpg';
          },
          error: () => {
            this.profileImageUrl = 'assets/images/male.jpg';
          }
        });
      } else if (this.userInfo.role === 'Lawyer') {
        this.lawyerService.GetLawyerDetails().subscribe({
          next: (profile) => {
            this.profileImageUrl = profile.imageUrl
              ? (profile.imageUrl.startsWith('http') ? profile.imageUrl : 'https://localhost:44302' + profile.imageUrl)
              : 'assets/images/male.jpg';
          },
          error: () => {
            this.profileImageUrl = 'assets/images/male.jpg';
          }
        });
      } else {
        this.profileImageUrl = 'assets/images/male.jpg';
      }
    } else {
      this.profileImageUrl = 'assets/images/male.jpg';
    }
  }

  GoToProfile() {
    if (this.userInfo?.role === 'Client') {
      this.router.navigate(['/client/profile']);
    } else {
      this.router.navigate(['/profile', this.userInfo?.userId]);
    }
  }

  GoToOverviewOrDashboard() {
    if (this.userInfo?.role === 'Client') {
      this.router.navigate(['/client/overview']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}