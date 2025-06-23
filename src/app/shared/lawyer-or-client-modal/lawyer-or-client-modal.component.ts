import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-lawyer-or-client-modal',
  imports: [],
  templateUrl: './lawyer-or-client-modal.component.html',
  styleUrl: './lawyer-or-client-modal.component.css'
})
export class LawyerOrClientModalComponent {



  @Input() signOutOrSignIn: string="";
 

   
}
