import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lawyer-or-client-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lawyer-or-client-modal.component.html',
  styleUrls: ['./lawyer-or-client-modal.component.css']
})
export class LawyerOrClientModalComponent {
  @Input() signOutOrSignIn: string = "";
}
