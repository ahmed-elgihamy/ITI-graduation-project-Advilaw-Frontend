import { AuthService } from './../../core/services/auth.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LawyerOrClientModalComponent } from '../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../types/UserInfo';

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
  readonly _auth = inject(AuthService);
  readonly router = inject(Router);
  userInfo: UserInfo | null = null;
  isLawyer: boolean = false;
  isClient: boolean = false;

  ngOnInit(): void {
    this.sub = this._auth.isLoggedIn$.subscribe((res) => (this.isLogged = res));
    this.userInfo = this._auth.getUserInfo();
    this.isLawyer = this.userInfo?.role === 'Lawyer';
    this.isClient = this.userInfo?.role === 'Client';
    console.log(this.isLawyer);
  }

  GoToProfile() {
    // console.log(`link to go: /profile/${this.userInfo?.userId}`);
    this.router.navigate(['/profile', this.userInfo?.userId]);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
