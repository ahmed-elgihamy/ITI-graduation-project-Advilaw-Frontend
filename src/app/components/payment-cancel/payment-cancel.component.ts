import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-cancel.component.html',
  styleUrl: './payment-cancel.component.css'
})
export class PaymentCancelComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get error parameter from URL
    const error = this.route.snapshot.queryParamMap.get('error');
    if (error) {
      switch (error) {
        case 'payment_cancelled':
          this.errorMessage = 'Payment was cancelled by the user.';
          break;
        default:
          this.errorMessage = 'Payment was cancelled or failed.';
      }
    } else {
      this.errorMessage = 'Payment was cancelled.';
    }
  }

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