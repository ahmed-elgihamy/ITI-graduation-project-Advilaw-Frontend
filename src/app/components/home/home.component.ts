import { Component } from '@angular/core';
import { LawyerOrClientModalComponent } from "../../shared/lawyer-or-client-modal/lawyer-or-client-modal.component";

@Component({
  selector: 'app-home',
  imports: [LawyerOrClientModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showModal() {
   var signOutBtn=document.getElementById("signOutBtn");
   signOutBtn?.click();
  }
}
