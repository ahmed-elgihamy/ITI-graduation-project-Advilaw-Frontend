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
  deleteError: string = '';
  editError: string = '';
  isLoading: boolean = false;
  isDeleting: boolean = false;
  isUpdating: boolean = false;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private PlatformSubscriptionService: PlatformSubscriptionService
  ) {}
  
  ngOnInit(): void {
    this.initializeFormGroup();
    this.loadSubscriptionPlans();
  }

  loadSubscriptionPlans(): void {
    this.isLoading = true;
    this.PlatformSubscriptionService.GetAllPlatformSubscription().subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO[]>) => {
        console.log(res);
        this.platFormSubscriptionSubject.next(res.data);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load subscription plans:', err);
        this.isLoading = false;
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
          this.showSuccessMessage('Subscription plan created successfully!');
          this.resetForm();
        },
        error: (err: any) => {
          console.error('Failed to create subscription plan:', err);
          this.showErrorMessage('Failed to create subscription plan. Please try again.');
        },
      });
      // Close modal
      const modalEl = document.getElementById('addPlanModal');
      const modal = bootstrap.Modal.getInstance(modalEl!);
      modal?.hide();
    }
  }

  openDeleteConfirmationModal(planId: number) {
    this.selectedPlanId = planId;
    this.deleteError = '';
    const modal = new bootstrap.Modal(
      document.getElementById('deletePlanModal')!
    );
    modal.show();
  }

  deletePlan(planId: number) {
    if (!planId) {
      this.deleteError = 'Invalid plan ID';
      return;
    }

    this.isDeleting = true;
    this.deleteError = '';
    
    this.PlatformSubscriptionService.DeletePlatformSubscription(planId).subscribe({
      next: (response) => {
        console.log('Delete response:', response);
        this.isDeleting = false;
        this.loadSubscriptionPlans();
        this.showSuccessMessage('Subscription plan deleted successfully!');
        
        // Close modal manually if needed
        const modalEl = document.getElementById('deletePlanModal');
        const modal = bootstrap.Modal.getInstance(modalEl!);
        if (modal) {
          modal.hide();
        }
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.isDeleting = false;
        
        // Handle different types of errors
        if (err?.error?.message) {
          this.deleteError = err.error.message;
        } else if (err?.status === 400) {
          this.deleteError = 'Cannot delete this plan because it has active user subscriptions.';
        } else if (err?.status === 404) {
          this.deleteError = 'Subscription plan not found.';
        } else {
          this.deleteError = 'Failed to delete subscription plan. Please try again.';
        }
      }
    });
  }

  openEditModelPlan(planId: number) {
    this.selectedPlanId = planId;
    this.editError = '';
    // Find the plan and patch the form
    const plan = this.platFormSubscriptionSubject.value.find(p => p.id === planId);
    if (plan) {
      this.addPlanForm.patchValue({
        name: plan.name,
        price: plan.price,
        points: plan.points,
        isActive: plan.isActive
      });
    }
  }

  closeEditModelPlan() {
    this.addPlanForm.reset();
    this.selectedPlanId = null;
    this.editError = '';
    console.log(this.addPlanForm.value);
  }

  updatePlan(planId: number) {
    if (this.addPlanForm.valid && planId) {
      this.isUpdating = true;
      this.editError = '';
      
      const updatedPlan = this.addPlanForm.value;
      let { isActive, ...UpdatePlanData } = updatedPlan;
      
      this.PlatformSubscriptionService.UpdatePlatformSubscription(
        planId,
        UpdatePlanData
      ).subscribe({
        next: () => {
          this.isUpdating = false;
          this.loadSubscriptionPlans();
          this.showSuccessMessage('Subscription plan updated successfully!');
          
          // Close modal manually if needed
          const modalEl = document.getElementById('editPlanModal');
          const modal = bootstrap.Modal.getInstance(modalEl!);
          if (modal) {
            modal.hide();
          }
        },
        error: (err: any) => {
          console.error('Update error:', err);
          this.isUpdating = false;
          
          if (err?.error?.message) {
            this.editError = err.error.message;
          } else {
            this.editError = 'Failed to update subscription plan. Please try again.';
          }
        },
      });
    }
  }

  toggleActivation(planId: number) {
    this.PlatformSubscriptionService.ToggleActivation(planId).subscribe({
      next: (res: ApiResponse<PlatformSubscriptionDTO[]>) => {
        console.log(res);
        this.loadSubscriptionPlans();
        this.showSuccessMessage('Subscription plan status updated successfully!');
      },
      error: (err: any) => {
        console.error('Failed to toggle activation:', err);
        this.showErrorMessage('Failed to update subscription plan status. Please try again.');
      },
    });
  }

  private resetForm() {
    this.addPlanForm.reset({
      name: '',
      price: 0,
      points: 0,
      isActive: false,
    });
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  private showErrorMessage(message: string) {
    // You can implement a toast notification here
    console.error(message);
  }
}
