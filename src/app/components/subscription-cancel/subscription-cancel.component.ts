import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-cancel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-cancel.component.html',
  styleUrl: './subscription-cancel.component.css'
})
export class SubscriptionCancelComponent {

  constructor(private router: Router) {}

  goToSubscriptionPlans(): void {
    this.router.navigate(['/subscriptions/plan']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
} 