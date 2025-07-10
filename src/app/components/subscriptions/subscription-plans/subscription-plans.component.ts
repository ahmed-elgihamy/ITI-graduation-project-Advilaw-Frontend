import { Component, OnInit, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlatformSubscriptionService } from '../../../core/services/platform-subscription.service';
import { PlatformSubscriptionDTO } from '../../../types/PlatformSubscription/PlatformSubscriptionDTO';
import { ApiResponse } from '../../../types/ApiResponse';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-plans',
  imports: [CommonModule],
  templateUrl: './subscription-plans.component.html',
  styleUrl: './subscription-plans.component.css',
})
export class SubscriptionPlansComponent implements OnInit {
  private subscriptionPlansSubject = new BehaviorSubject<
    PlatformSubscriptionDTO[]
  >([]);
  public subscriptionPlans$: Observable<PlatformSubscriptionDTO[]> =
    this.subscriptionPlansSubject.asObservable();

  isLoading = false;
  error = '';
  selectedPlan: PlatformSubscriptionDTO | null = null;
  isProcessingPayment = false;

  constructor(
    private platFormSubscriptionService: PlatformSubscriptionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = '';
    
    this.platFormSubscriptionService.GetPlatformSubscriptionPlans().subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO[]>) => {
        console.log('Subscription plans loaded:', res);
        this.subscriptionPlansSubject.next(res.data || []);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load subscription plans:', err);
        this.error = 'Failed to load subscription plans. Please try again.';
        this.isLoading = false;
      },
    });
  }

  choosePlan(plan: PlatformSubscriptionDTO) {
    console.log('Selected plan:', plan);
    this.selectedPlan = plan;
    
    // Check if user is authenticated
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) {
      alert('Please login to purchase a subscription plan.');
      this.router.navigate(['/login']);
      return;
    }

    // Check if user is a lawyer
    if (userInfo.role !== 'Lawyer') {
      alert('Only lawyers can purchase subscription plans.');
      return;
    }

    // Proceed with subscription purchase
    this.purchaseSubscription(plan);
  }

  purchaseSubscription(plan: PlatformSubscriptionDTO) {
    this.isProcessingPayment = true;
    this.error = '';
    
    // Call the backend to purchase subscription
    this.platFormSubscriptionService.buySubscription(plan.id).subscribe({
      next: (response: ApiResponse<any>) => {
        console.log('Subscription purchase response:', response);
        if (response.succeeded) {
          alert(`Successfully subscribed to ${plan.name}! Your subscription is now active.`);
          this.router.navigate(['/dashboard']);
        } else {
          this.error = response.message || 'Failed to process subscription purchase.';
          this.isProcessingPayment = false;
        }
      },
      error: (error: any) => {
        console.error('Subscription purchase error:', error);
        this.error = 'Failed to process subscription purchase. Please try again.';
        this.isProcessingPayment = false;
      }
    });
  }

  getPlanFeatures(plan: PlatformSubscriptionDTO): string[] {
    // Return features based on plan points
    const features: string[] = [];
    
    if (plan.points >= 100) {
      features.push('Priority Support');
      features.push('Advanced Analytics');
      features.push('Unlimited Consultations');
    }
    
    if (plan.points >= 50) {
      features.push('Premium Profile');
      features.push('Featured Listings');
      features.push('Email Support');
    }
    
    features.push('Basic Platform Access');
    features.push('Standard Support');
    
    return features;
  }

  getPlanBadgeClass(plan: PlatformSubscriptionDTO): string {
    if (plan.points >= 100) return 'badge bg-premium';
    if (plan.points >= 50) return 'badge bg-pro';
    return 'badge bg-basic';
  }

  getPlanBadgeText(plan: PlatformSubscriptionDTO): string {
    if (plan.points >= 100) return 'Premium';
    if (plan.points >= 50) return 'Pro';
    return 'Basic';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
