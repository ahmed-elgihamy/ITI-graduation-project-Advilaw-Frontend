import { AuthService } from './../../core/services/auth.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LawyerOrClientModalComponent } from '../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component';
import { RouterLink, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  ngOnInit(): void {
    this.sub = this._auth.isLoggedIn$.subscribe((res) => (this.isLogged = res));
    this.userInfo = this._auth.getUserInfo();
    console.log(this.userInfo);
  }

  GoToProfile() {
    // console.log(`link to go: /profile/${this.userInfo?.userId}`);
    this.router.navigate(['/profile', this.userInfo?.userId]);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
