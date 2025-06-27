import { AuthService } from './../../core/services/auth.service';
import { Component, inject, OnDestroy } from '@angular/core';
import { LawyerOrClientModalComponent } from "../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component";
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [LawyerOrClientModalComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Corrected property name
})
export class NavbarComponent implements OnDestroy {

  isLogged: boolean = false;
  private sub!: Subscription;
  readonly _auth = inject(AuthService);

  ngOnInit(): void {
    this.sub = this._auth.isLoggedIn$.subscribe((status) => {
      this.isLogged = status;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
