import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../../../../types/ApiResponse';
import { LawyerPaymentListDTO } from '../../../../types/Lawyers/LawyerPaymentListDTO';
import { PagedResponse } from '../../../../types/PagedResponse';
import { PaymentsService } from '../../../../core/services/payments.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LawyerPaymentsService } from '../../../../core/services/lawyer/dashboard/lawyer-payments.service';
import { DashboardTableComponent } from '../../dashboard-table/dashboard-table.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-lawyer-payments',
  standalone: true,
  imports: [DashboardTableComponent, PaginationComponent,CommonModule],
  templateUrl: './lawyerPayments.component.html',
  styleUrls: ['./lawyerPayments.component.css']
})
export class LawyerPaymentsComponent implements OnInit {
  ApiService: any;
  Role: string | null = null;
  stripeAccountStatus: any = null;
  loading = false;
  error: string | null = null;
  constructor(
    private PaymentsService: PaymentsService,
    private authService: AuthService,
    private lawyerPaymentsService: LawyerPaymentsService
  ) {
    this.ApiService = PaymentsService;
    this.Role = authService.getUserInfo()?.role ?? null;
  }

  ngOnInit(): void {
    this.loadData(1);
    this.checkStripeAccountStatus();
  }

  paymentColumns = [
    {
      key: 'senderImgUrl',
      label: 'Image',
      type: 'image',
    },
    { key: 'senderId', label: 'ID' },
    { key: 'senderName', label: 'Sender' },
    { key: 'type', label: 'Payment Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'createdAt', label: 'Date' },
  ];

  payments: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  loadData(page: number): void {
    this.currentPage = page;

    if (this.Role === 'Lawyer') {
      this.ApiService.GetLawyerPayments(page).subscribe({
        next: (res: ApiResponse<PagedResponse<LawyerPaymentListDTO>>) => {
          const pagedData = res.data;
          this.payments = pagedData.data;
          this.totalPages = pagedData.totalPages;
          this.pageSize = pagedData.pageSize;
          this.currentPage = pagedData.pageNumber;
          console.log(res);
        },
        error: (err: any) => {
          console.error('Failed to load jobs:', err);
        },
      });
    }
  }

  checkStripeAccountStatus() {
    this.loading = true;
    this.lawyerPaymentsService.getStripeAccountStatus().subscribe({
      next: (status) => {
        this.stripeAccountStatus = status;

        this.loading = false;
        // Log ChargesEnabled to the console
        console.log('Stripe chargesEnabled:', status.chargesEnabled);

        // Optionally, log the whole status object for more details
        console.log('Stripe Account Status:', status);
      },
      error: (err) => {
        this.stripeAccountStatus = null;

        this.loading = false;
        if (err.status === 400 || err.status === 404) {
          // No Stripe account yet
        } else {
          this.error = err.error?.message || 'Error checking Stripe status';
        }
      }
    });
  }

  //helper methods for ui
  setupStripeAccount() {
    this.lawyerPaymentsService.createStripeAccount().subscribe({
      next: () => this.startOnboarding(),
      error: (err) => this.error = err.error?.message || 'Error creating Stripe account'
    });
  }

  startOnboarding() {
    this.lawyerPaymentsService.getStripeOnboardingLink().subscribe({
      next: (res) => window.location.href = res.url,
      error: (err) => this.error = err.error?.message || 'Error getting onboarding link'
    });
  }

  openStripeDashboard() {
    this.lawyerPaymentsService.getStripeDashboardLink().subscribe({
      next: (res) => window.open(res.url, '_blank'),
      error: (err) => this.error = err.error?.message || 'Error getting dashboard link'
    });
  }

  get isStripeConnected(): boolean {
    return !!this.stripeAccountStatus?.chargesEnabled;
  }
  
  get isStripeOnboardingRequired(): boolean {
    return !this.stripeAccountStatus;
  }
  
  get isStripePending(): boolean {
    return !!this.stripeAccountStatus && !this.stripeAccountStatus.chargesEnabled;
  }
  

}
