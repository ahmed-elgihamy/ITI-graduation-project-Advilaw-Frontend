import { Component, OnInit, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlatformSubscriptionService, CreateLawyerSubscriptionRequest, SingleSubscriptionRequest } from '../../../core/services/platform-subscription.service';
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

    // Proceed with Stripe checkout for subscription purchase
    this.createCheckoutSession(plan);
  }

  createCheckoutSession(plan: PlatformSubscriptionDTO) {
    this.isProcessingPayment = true;
    this.error = '';
    
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) {
      this.error = 'User not authenticated';
      this.isProcessingPayment = false;
      return;
    }

    // Use the correct property for lawyerId
    const lawyerId = userInfo.userId; // <-- FIXED: use userId instead of id

    const subscriptionRequest: SingleSubscriptionRequest = {
      subscriptionTypeId: plan.id,
      amount: plan.price,
      subscriptionName: plan.name
    };

    const checkoutRequest: CreateLawyerSubscriptionRequest = {
      lawyerId: lawyerId,
      subscriptions: [subscriptionRequest]
    };

    console.log('Creating checkout session:', checkoutRequest);
    
    this.platFormSubscriptionService.createSubscriptionCheckoutSession(checkoutRequest).subscribe({
      next: (response: { url: string }) => {
        console.log('Checkout session created:', response);
        this.isProcessingPayment = false;
        
        // Redirect to Stripe checkout
        if (response.url) {
          window.location.href = response.url;
        } else {
          this.error = 'Failed to create checkout session';
        }
      },
      error: (error: any) => {
        console.error('Checkout session creation error:', error);
        this.error = 'Failed to create checkout session. Please try again.';
        this.isProcessingPayment = false;
      }
    });
  }

  // Legacy method - keeping for reference but not used
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
