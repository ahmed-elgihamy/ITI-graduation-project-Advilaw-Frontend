import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EscrowService, ConfirmSessionPaymentResponse } from '../../core/services/escrow.service';
import { ApiResponse } from '../../types/ApiResponse';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  sessionId: string = '';
  escrowId: string = '';
  confirmedSessionId: number | null = null;
  isConfirming = false;
  isConfirmed = false;
  error = '';
  paymentDetails: ConfirmSessionPaymentResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private escrowService: EscrowService
  ) {}

  ngOnInit(): void {
    // Get parameters from URL
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id') || '';
    this.escrowId = this.route.snapshot.queryParamMap.get('escrow_id') || '';

    if (this.sessionId) {
      this.confirmPayment();
    } else {
      this.error = 'No payment session found';
    }
  }

  confirmPayment(): void {
    this.isConfirming = true;
    this.error = '';

    this.escrowService.confirmSessionPayment({
      stripeSessionId: this.sessionId
    }).subscribe({
      next: (response: any) => {
        this.isConfirming = false;
        this.isConfirmed = true;
        console.log('Payment confirmation response:', response);

        // Accept both { data: { sessionId } } and { sessionId }
        let sessionId: number | null = null;
        if (response && response.data && typeof response.data.sessionId !== 'undefined') {
          this.paymentDetails = response.data;
          sessionId = Number(response.data.sessionId);
        } else if (typeof response.sessionId !== 'undefined') {
          this.paymentDetails = response;
          sessionId = Number(response.sessionId);
        }

        if (sessionId) {
          this.confirmedSessionId = sessionId;
          this.updatePaymentStatus();
        } else {
          this.error = 'Payment confirmed, but no session ID was returned. Please contact support.';
          this.confirmedSessionId = null;
        }
      },
      error: (error) => {
        console.error('Error confirming payment:', error);
        this.error = 'Failed to confirm payment. Please contact support.';
        this.isConfirming = false;
      }
    });
  }

  updatePaymentStatus(): void {
    // Store payment confirmation in localStorage for dashboard to pick up
    const paymentUpdate = {
      sessionId: this.confirmedSessionId || this.sessionId,
      escrowId: this.escrowId,
      status: 'completed',
      confirmedAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    const existingUpdates = JSON.parse(localStorage.getItem('paymentUpdates') || '[]');
    existingUpdates.push(paymentUpdate);
    localStorage.setItem('paymentUpdates', JSON.stringify(existingUpdates));
  }

  goToCountdown(): void {
    if (this.confirmedSessionId) {
      this.router.navigate(['/countdown', this.confirmedSessionId]);
    } else {
      console.error('No confirmed session ID available');
      this.goToDashboard();
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

  retryConfirmation(): void {
    this.confirmPayment();
  }
} 