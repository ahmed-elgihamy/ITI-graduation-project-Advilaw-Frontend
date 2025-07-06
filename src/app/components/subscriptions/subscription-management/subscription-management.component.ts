import { CreatePlatformSubscriptionDTO } from './../../../types/PlatformSubscription/CreatePlatformSubscriptionDTO';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlatformSubscriptionDTO } from '../../../types/PlatformSubscription/PlatformSubscriptionDTO';
import { PlatformSubscriptionService } from './../../../core/services/platform-subscription.service';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../../../types/ApiResponse';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-subscription-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-management.component.html',
  styleUrl: './subscription-management.component.css',
})
export class SubscriptionManagementComponent implements OnInit {
  addPlanForm!: FormGroup;
  selectedPlanId: number | null = null;
  platFormSubscriptionSubject = new BehaviorSubject<PlatformSubscriptionDTO[]>(
    []
  );
  public subscriptionPlans$: Observable<PlatformSubscriptionDTO[]> =
    this.platFormSubscriptionSubject.asObservable();
  constructor(
    private fb: FormBuilder,
    private PlatformSubscriptionService: PlatformSubscriptionService
  ) {}
  ngOnInit(): void {
    this.initializeFormGroup();
    this.loadSubscriptionPlans();
  }

  loadSubscriptionPlans(): void {
    this.PlatformSubscriptionService.GetAllPlatformSubscription().subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO[]>) => {
        console.log(res);
        this.platFormSubscriptionSubject.next(res.data);
      },
      error: (err: any) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }

  initializeFormGroup() {
    this.addPlanForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      points: [0, [Validators.required, Validators.min(0)]],
      isActive: [false],
    });
  }

  addPlan(): void {
    if (this.addPlanForm.valid) {
      const newPlan: CreatePlatformSubscriptionDTO = this.addPlanForm.value;
      console.log('Submitting new plan:', newPlan);

      this.PlatformSubscriptionService.AddPlatformSubscription(
        newPlan
      ).subscribe({
        next: (res: ApiResponse<PlatformSubscriptionDTO>) => {
          console.log(res);
          this.loadSubscriptionPlans();
        },
        error: (err: any) => {
          console.error('Failed to load jobs:', err);
        },
      });
      // Close modal
      const modalEl = document.getElementById('addPlanModal');
      const modal = bootstrap.Modal.getInstance(modalEl!);
      modal?.hide();

      // Reset form
      this.addPlanForm.reset({
        name: '',
        price: 0,
        points: 0,
        isActive: false,
      });

      // Refresh list
      this.loadSubscriptionPlans(); // if available
    }
  }

  openDeleteConfirmationModal(planId: number) {
    const modal = new bootstrap.Modal(
      document.getElementById('deletePlanConfirmationModal')!
    );
    modal.show();
  }

  deletePlan(planId: number) {
    this.PlatformSubscriptionService.DeletePlatformSubscription(
      planId
    ).subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO>) => {
        console.log(res);
        this.loadSubscriptionPlans();
        const modalEl = document.getElementById('deletePlanModal');
        const modal = bootstrap.Modal.getInstance(modalEl!);
        console.log(modalEl);
        console.log(modal);
        modal?.hide();
      },
      error: (err: any) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }

  openEditModelPlan(planId: number) {
    this.selectedPlanId = planId;
    // change form values
    this.platFormSubscriptionSubject.subscribe((plans) => {
      const selectedPlan = plans.find((plan) => plan.id === planId);
      if (selectedPlan) {
        this.addPlanForm.patchValue({
          name: selectedPlan.name,
          price: selectedPlan.price,
          points: selectedPlan.points,
          isActive: selectedPlan.isActive,
        });
      }
    });
  }

  closeEditModelPlan() {
    this.addPlanForm.reset();
    this.selectedPlanId = null;
    console.log(this.addPlanForm.value);
  }

  updatePlan(planId: number) {
    const updatedPlan = this.addPlanForm.value;
    let { isActive, ...UpdatePlanData } = updatedPlan;
    // console.log(UpdatePlanData);
    this.PlatformSubscriptionService.UpdatePlatformSubscription(
      planId,
      UpdatePlanData
    ).subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO>) => {
        console.log(res);
        this.loadSubscriptionPlans();
        const modalEl = document.getElementById('editPlanModal');
        const modal = bootstrap.Modal.getInstance(modalEl!);
        modal?.hide();
      },
      error: (err: any) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }

  toggleActivation(planId: number) {
    this.PlatformSubscriptionService.ToggleActivation(planId).subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO[]>) => {
        console.log(res);
        this.loadSubscriptionPlans();
      },
      error: (err: any) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }
}
