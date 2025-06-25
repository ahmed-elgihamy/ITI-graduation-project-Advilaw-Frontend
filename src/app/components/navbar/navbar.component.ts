import { Component } from '@angular/core';
import { LawyerOrClientModalComponent } from "../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [LawyerOrClientModalComponent,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
}
