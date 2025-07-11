import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformSubscriptionService } from '../../core/services/platform-subscription.service';
import { ApiResponse } from '../../types/ApiResponse';

@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-success.component.html',
  styleUrl: './subscription-success.component.css'
})
export class SubscriptionSuccessComponent implements OnInit {
  sessionId: string = '';
  isConfirming = false;
  isConfirmed = false;
  error = '';
  subscriptionDetails: any = null;
  updatedPoints: number | null = null; // <-- Add this

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private platformSubscriptionService: PlatformSubscriptionService
  ) {}

  ngOnInit(): void {
    // Get session_id from URL query parameters
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id') || '';

    if (this.sessionId) {
      this.confirmSubscription();
    } else {
      this.error = 'No payment session found';
    }
  }

  confirmSubscription(): void {
    this.isConfirming = true;
    this.error = '';

    this.platformSubscriptionService.confirmSubscriptionSession({
      sessionId: this.sessionId
    }).subscribe({
      next: (response: any) => {
        this.isConfirming = false;
        this.isConfirmed = true;
        this.subscriptionDetails = response.results;
        this.updatedPoints = response.updatedPoints; // <-- Set updated points
        this.showSuccessMessage();
      },
      error: (error) => {
        console.error('Error confirming subscription:', error);
        this.error = 'Failed to confirm subscription. Please contact support.';
        this.isConfirming = false;
      }
    });
  }

  showSuccessMessage(): void {
    // Show success message and redirect after a delay
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  retryConfirmation(): void {
    if (this.sessionId) {
      this.confirmSubscription();
    }
  }
} 