import { Component } from '@angular/core';
import { LawyerOrClientModalComponent } from "../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component";

@Component({
  selector: 'app-navbar',
  imports: [LawyerOrClientModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  openedFrom(str: string) {
    this.signInOrSignOut=str;
  }

  signInOrSignOut:string="";
}
