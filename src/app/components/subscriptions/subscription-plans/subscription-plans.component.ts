import { Component, OnInit, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlatformSubscriptionService } from '../../../core/services/platform-subscription.service';
import { PlatformSubscriptionDTO } from '../../../types/PlatformSubscription/PlatformSubscriptionDTO';
import { ApiResponse } from '../../../types/ApiResponse';
import { CommonModule } from '@angular/common';

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

  constructor(
    private platFormSubscriptionService: PlatformSubscriptionService
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.platFormSubscriptionService.GetPlatformSubscriptionPlans().subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO[]>) => {
        console.log(res);
        this.subscriptionPlansSubject.next(res.data);
      },
      error: (err: any) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }

  choosePlan(plan: PlatformSubscriptionDTO) {
    console.log(plan);
  }
}
