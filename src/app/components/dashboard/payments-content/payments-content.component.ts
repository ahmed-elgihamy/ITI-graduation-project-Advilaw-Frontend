import { ApiResponse } from '../../../types/ApiResponse';
import { LawyerPaymentListDTO } from '../../../types/Lawyers/LawyerPaymentListDTO';
import { PagedResponse } from '../../../types/PagedResponse';
import { PaymentsService } from './../../../core/services/payments.service';
import { Component } from '@angular/core';
import { DashboardTableComponent } from '../dashboard-table/dashboard-table.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payments-content',
  imports: [DashboardTableComponent, PaginationComponent],
  templateUrl: './payments-content.component.html',
  styleUrl: './payments-content.component.css',
})
export class PaymentsContentComponent {
  ApiService: any;
  Role: string | null = null;
  constructor(
    private PaymentsService: PaymentsService,
    private authService: AuthService
  ) {
    this.ApiService = PaymentsService;
    this.Role = authService.getUserInfo()?.role ?? null;
  }
  ngOnInit(): void {
    this.loadData(1);
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
          this.payments = pagedData.data; // actual job list
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
}
