import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EscrowService, ConfirmSessionPaymentResponse } from '../../core/services/escrow.service';

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
      next: (response) => {
        this.isConfirming = false;
        this.isConfirmed = true;
        this.paymentDetails = response.data;
        this.confirmedSessionId = response.data.sessionId;
        console.log('Payment confirmed successfully:', response);
        
        // Update payment status in localStorage for dashboard refresh
        this.updatePaymentStatus();
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