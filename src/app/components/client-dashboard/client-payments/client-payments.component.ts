import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { EscrowService } from '../../../core/services/escrow.service';
import { ClientPaymentDTO, ClientPaymentStatistics, ClientBalance, WithdrawalRequest, ClientPaymentType, PaymentStatus, WithdrawalStatus } from '../../../types/Clients/ClientPaymentDTO';
import { PagedResponse } from '../../../types/PagedResponse';
import { ApiResponse } from '../../../types/ApiResponse';

@Component({
  selector: 'app-client-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-payments.component.html',
  styleUrl: './client-payments.component.css'
})
export class ClientPaymentsComponent implements OnInit {
  @ViewChild('paymentsSection', { static: false }) paymentsSection!: ElementRef;
  
  // Payment data
  payments: ClientPaymentDTO[] = [];
  withdrawals: WithdrawalRequest[] = [];
  statistics: ClientPaymentStatistics = {
    totalPayments: 0,
    totalAmount: 0,
    pendingAmount: 0,
    completedAmount: 0,
    failedAmount: 0,
    refundedAmount: 0,
    currentBalance: 0,
    totalWithdrawals: 0,
    withdrawalAmount: 0,
    successRate: 0
  };
  balance: ClientBalance = {
    availableBalance: 0,
    pendingBalance: 0,
    totalBalance: 0,
    currency: 'USD'
  };

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;

  // Loading states
  isLoading = false;
  isLoadingStatistics = false;
  isLoadingBalance = false;
  isLoadingWithdrawals = false;

  // Error handling
  error = '';
  statisticsError = '';
  balanceError = '';
  withdrawalsError = '';

  // Filter properties
  selectedStatus: string = 'all';
  selectedType: string = 'all';
  searchTerm: string = '';
  dateRange: string = 'all';

  // Withdrawal modal
  showWithdrawalModal = false;
  withdrawalAmount = 0;
  withdrawalMethod = 'bank';
  bankAccount = '';
  isSubmittingWithdrawal = false;

  // Available filters
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: PaymentStatus.Pending, label: 'Pending' },
    { value: PaymentStatus.Processing, label: 'Processing' },
    { value: PaymentStatus.Completed, label: 'Completed' },
    { value: PaymentStatus.Failed, label: 'Failed' },
    { value: PaymentStatus.Cancelled, label: 'Cancelled' },
    { value: PaymentStatus.Refunded, label: 'Refunded' }
  ];

  typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: ClientPaymentType.SessionPayment, label: 'Session Payment' },
    { value: ClientPaymentType.RefundPayment, label: 'Refund Payment' },
    { value: ClientPaymentType.SubscriptionPayment, label: 'Subscription Payment' },
    { value: ClientPaymentType.WithdrawPayment, label: 'Withdrawal Payment' },
    { value: ClientPaymentType.EscrowPayment, label: 'Escrow Payment' },
    { value: ClientPaymentType.ConsultationPayment, label: 'Consultation Payment' }
  ];

  dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  // Expose enums to template
  PaymentStatus = PaymentStatus;
  ClientPaymentType = ClientPaymentType;
  WithdrawalStatus = WithdrawalStatus;
  Math = Math;

  constructor(
    private clientService: ClientService,
    private escrowService: EscrowService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
    this.checkPaymentUpdates();
    // Start polling for payment status updates (optional)
    // this.startPaymentStatusPolling();
  }

  loadAllData(): void {
    this.loadStatistics();
    this.loadBalance();
    this.loadPayments(1);
    this.loadWithdrawals(1);
  }

  loadStatistics(): void {
    this.isLoadingStatistics = true;
    this.statisticsError = '';

    // For now, using mock data since API might not be available
    this.loadMockStatistics();
    
    // Uncomment when API is available:
    // this.clientService.getClientPaymentStatistics().subscribe({
    //   next: (response) => {
    //     this.statistics = response.data;
    //     this.isLoadingStatistics = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading payment statistics:', error);
    //     this.statisticsError = 'Failed to load payment statistics';
    //     this.isLoadingStatistics = false;
    //   }
    // });
  }

  loadBalance(): void {
    this.isLoadingBalance = true;
    this.balanceError = '';

    // For now, using mock data since API might not be available
    this.loadMockBalance();
    
    // Uncomment when API is available:
    // this.clientService.getClientBalance().subscribe({
    //   next: (response) => {
    //     this.balance = response.data;
    //     this.isLoadingBalance = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading balance:', error);
    //     this.balanceError = 'Failed to load balance';
    //     this.isLoadingBalance = false;
    //   }
    // });
  }

  loadPayments(page: number): void {
    this.isLoading = true;
    this.error = '';
    this.currentPage = page;

    // For now, using mock data since API might not be available
    this.loadMockPayments();
    
    // Uncomment when API is available:
    // this.clientService.getClientPayments(page, this.pageSize).subscribe({
    //   next: (response) => {
    //     const pagedData = response.data;
    //     this.payments = pagedData.data;
    //     this.totalPages = pagedData.totalPages;
    //     this.totalItems = pagedData.totalItems;
    //     this.currentPage = pagedData.pageNumber;
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading payments:', error);
    //     this.error = 'Failed to load payments';
    //     this.isLoading = false;
    //   }
    // });
  }

  loadWithdrawals(page: number): void {
    this.isLoadingWithdrawals = true;
    this.withdrawalsError = '';

    // For now, using mock data since API might not be available
    this.loadMockWithdrawals();
    
    // Uncomment when API is available:
    // this.clientService.getClientWithdrawals(page, this.pageSize).subscribe({
    //   next: (response) => {
    //     const pagedData = response.data;
    //     this.withdrawals = pagedData.data;
    //     this.isLoadingWithdrawals = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading withdrawals:', error);
    //     this.withdrawalsError = 'Failed to load withdrawals';
    //     this.isLoadingWithdrawals = false;
    //   }
    // });
  }

  // Mock data methods (remove when API is available)
  private loadMockStatistics(): void {
    setTimeout(() => {
      this.statistics = {
        totalPayments: 15,
        totalAmount: 2500.00,
        pendingAmount: 150.00,
        completedAmount: 2200.00,
        failedAmount: 50.00,
        refundedAmount: 100.00,
        currentBalance: 850.00,
        totalWithdrawals: 5,
        withdrawalAmount: 600.00,
        successRate: 93.3
      };
      this.isLoadingStatistics = false;
    }, 1000);
  }

  private loadMockBalance(): void {
    setTimeout(() => {
      this.balance = {
        availableBalance: 850.00,
        pendingBalance: 150.00,
        totalBalance: 1000.00,
        currency: 'USD'
      };
      this.isLoadingBalance = false;
    }, 800);
  }

  private loadMockPayments(): void {
    setTimeout(() => {
      this.payments = [
        {
          id: 1,
          type: ClientPaymentType.SessionPayment,
          amount: 200.00,
          status: PaymentStatus.Completed,
          description: 'Legal consultation session with John Doe',
          recipientName: 'John Doe',
          recipientImgUrl: 'assets/images/lawyer1.jpg',
          jobId: 101,
          jobTitle: 'Contract Review',
          transactionId: 'TXN-001-2024',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:35:00Z',
          paymentMethod: 'Credit Card',
          fees: 5.00,
          netAmount: 195.00
        },
        {
          id: 2,
          type: ClientPaymentType.EscrowPayment,
          amount: 500.00,
          status: PaymentStatus.Pending,
          description: 'Escrow payment for contract drafting',
          recipientName: 'Jane Smith',
          recipientImgUrl: 'assets/images/lawyer2.jpg',
          jobId: 102,
          jobTitle: 'Contract Drafting',
          transactionId: 'TXN-002-2024',
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z',
          paymentMethod: 'Bank Transfer',
          fees: 10.00,
          netAmount: 490.00
        },
        {
          id: 3,
          type: ClientPaymentType.RefundPayment,
          amount: 100.00,
          status: PaymentStatus.Completed,
          description: 'Refund for cancelled consultation',
          recipientName: 'System',
          recipientImgUrl: 'assets/images/system.jpg',
          transactionId: 'TXN-003-2024',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:20:00Z',
          paymentMethod: 'Credit Card',
          fees: 0.00,
          netAmount: 100.00
        }
      ];
      this.totalPages = 1;
      this.totalItems = 3;
      this.isLoading = false;
    }, 1200);
  }

  private loadMockWithdrawals(): void {
    setTimeout(() => {
      this.withdrawals = [
        {
          id: 1,
          amount: 200.00,
          status: WithdrawalStatus.Completed,
          requestedAt: '2024-01-10T11:00:00Z',
          processedAt: '2024-01-11T09:30:00Z',
          bankAccount: '****1234',
          paymentMethod: 'Bank Transfer',
          fees: 2.00,
          netAmount: 198.00
        },
        {
          id: 2,
          amount: 150.00,
          status: WithdrawalStatus.Pending,
          requestedAt: '2024-01-12T15:45:00Z',
          bankAccount: '****5678',
          paymentMethod: 'PayPal',
          fees: 1.50,
          netAmount: 148.50
        }
      ];
      this.isLoadingWithdrawals = false;
    }, 1000);
  }

  // Filter methods
  applyFilters(): void {
    this.loadPayments(1);
  }

  clearFilters(): void {
    this.selectedStatus = 'all';
    this.selectedType = 'all';
    this.searchTerm = '';
    this.dateRange = 'all';
    this.loadPayments(1);
  }

  // Withdrawal methods
  openWithdrawalModal(): void {
    this.showWithdrawalModal = true;
    this.withdrawalAmount = 0;
    this.withdrawalMethod = 'bank';
    this.bankAccount = '';
  }

  closeWithdrawalModal(): void {
    this.showWithdrawalModal = false;
  }

  submitWithdrawal(): void {
    if (this.withdrawalAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (this.withdrawalAmount > this.balance.availableBalance) {
      alert('Insufficient balance');
      return;
    }

    this.isSubmittingWithdrawal = true;

    // For now, using mock submission
    setTimeout(() => {
      this.isSubmittingWithdrawal = false;
      this.showWithdrawalModal = false;
      this.loadAllData(); // Refresh data
      alert('Withdrawal request submitted successfully');
    }, 2000);

    // Uncomment when API is available:
    // this.clientService.requestWithdrawal(this.withdrawalAmount, this.withdrawalMethod, this.bankAccount).subscribe({
    //   next: (response) => {
    //     this.isSubmittingWithdrawal = false;
    //     this.showWithdrawalModal = false;
    //     this.loadAllData(); // Refresh data
    //     alert('Withdrawal request submitted successfully');
    //   },
    //   error: (error) => {
    //     console.error('Error submitting withdrawal:', error);
    //     this.isSubmittingWithdrawal = false;
    //     alert('Failed to submit withdrawal request');
    //   }
    // });
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.Completed:
        return 'badge bg-success';
      case PaymentStatus.Pending:
        return 'badge bg-warning';
      case PaymentStatus.Processing:
        return 'badge bg-info';
      case PaymentStatus.Failed:
        return 'badge bg-danger';
      case PaymentStatus.Cancelled:
        return 'badge bg-secondary';
      case PaymentStatus.Refunded:
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  }

  getTypeBadgeClass(type: ClientPaymentType): string {
    switch (type) {
      case ClientPaymentType.SessionPayment:
        return 'badge bg-primary';
      case ClientPaymentType.EscrowPayment:
        return 'badge bg-info';
      case ClientPaymentType.RefundPayment:
        return 'badge bg-success';
      case ClientPaymentType.SubscriptionPayment:
        return 'badge bg-warning';
      case ClientPaymentType.WithdrawPayment:
        return 'badge bg-secondary';
      case ClientPaymentType.ConsultationPayment:
        return 'badge bg-dark';
      default:
        return 'badge bg-secondary';
    }
  }

  getWithdrawalStatusBadgeClass(status: WithdrawalStatus): string {
    switch (status) {
      case WithdrawalStatus.Completed:
        return 'badge bg-success';
      case WithdrawalStatus.Pending:
        return 'badge bg-warning';
      case WithdrawalStatus.Processing:
        return 'badge bg-info';
      case WithdrawalStatus.Failed:
        return 'badge bg-danger';
      case WithdrawalStatus.Cancelled:
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }

  onPageChange(page: number): void {
    this.loadPayments(page);
  }

  // Escrow Payment Methods
  initiateEscrowPayment(payment: ClientPaymentDTO): void {
    if (payment.type !== ClientPaymentType.EscrowPayment || payment.status !== PaymentStatus.Pending) {
      console.error('Invalid payment type or status for escrow payment');
      return;
    }

    // Get current user ID from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      alert('User not authenticated');
      return;
    }

    const userData = JSON.parse(user);
    const clientId = userData.id || userData.userId || '';

    if (!clientId) {
      alert('User ID not found');
      return;
    }

    // Create payment request
    const paymentRequest = {
      jobId: payment.jobId || 0,
      clientId: clientId
    };

    // Call escrow service to create payment session
    this.escrowService.createSessionPayment(paymentRequest).subscribe({
      next: (response) => {
        if (response && response.checkoutUrl) {
          window.location.href = response.checkoutUrl;
        } else {
          alert('Failed to initiate payment.');
          console.error('Payment response error:', response);
        }
      },
      error: (error) => {
        console.error('Error creating escrow payment session:', error);
        alert('Failed to initiate payment. Please try again.');
      }
    });
  }

  canPayEscrow(payment: ClientPaymentDTO): boolean {
    return payment.type === ClientPaymentType.EscrowPayment && 
           payment.status === PaymentStatus.Pending;
  }

  getCurrentUserId(): string {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id || userData.userId || '';
    }
    return '';
  }

  // Helper methods for escrow payments
  getPendingEscrowPayments(): ClientPaymentDTO[] {
    return this.payments.filter(payment => 
      payment.type === ClientPaymentType.EscrowPayment && 
      payment.status === PaymentStatus.Pending
    );
  }

  scrollToPayments(): void {
    if (this.paymentsSection) {
      this.paymentsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Payment Status Update Methods
  checkPaymentUpdates(): void {
    const paymentUpdates = JSON.parse(localStorage.getItem('paymentUpdates') || '[]');
    if (paymentUpdates.length > 0) {
      this.updatePaymentStatuses(paymentUpdates);
      // Clear processed updates
      localStorage.removeItem('paymentUpdates');
    }
  }

  updatePaymentStatuses(updates: any[]): void {
    updates.forEach(update => {
      // Find and update the corresponding payment
      const paymentIndex = this.payments.findIndex(p => 
        p.transactionId === update.sessionId || 
        p.id === parseInt(update.escrowId)
      );
      
      if (paymentIndex !== -1) {
        this.payments[paymentIndex].status = PaymentStatus.Completed;
        this.payments[paymentIndex].updatedAt = update.confirmedAt;
        
        // Show success notification
        this.showPaymentUpdateNotification('Payment completed successfully!');
      }
    });
  }

  showPaymentUpdateNotification(message: string): void {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'payment-notification';
    notification.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Poll for payment status updates (optional)
  startPaymentStatusPolling(): void {
    setInterval(() => {
      this.checkPaymentUpdates();
    }, 10000); // Check every 10 seconds
  }
}
