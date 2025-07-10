import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-cancel.component.html',
  styleUrl: './payment-cancel.component.css'
})
export class PaymentCancelComponent {
  constructor(private router: Router) {}

  goToDashboard(): void {
    this.router.navigate(['/client/overview']);
  }

  goToConsultations(): void {
    this.router.navigate(['/client/consults']);
  }

  goToPayments(): void {
    this.router.navigate(['/client/payments']);
  }

  tryAgain(): void {
    // Go back to the previous page
    window.history.back();
  }
} 