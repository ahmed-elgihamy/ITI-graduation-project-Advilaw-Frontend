export interface ClientPaymentDTO {
  id: number;
  type: ClientPaymentType;
  amount: number;
  status: PaymentStatus;
  description: string;
  recipientId?: string;
  recipientName: string;
  recipientImgUrl: string;
  jobId?: number;
  jobTitle?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  fees?: number;
  netAmount?: number;
}

export enum ClientPaymentType {
  SessionPayment = 'SessionPayment',
  RefundPayment = 'RefundPayment',
  SubscriptionPayment = 'SubscriptionPayment',
  WithdrawPayment = 'WithdrawPayment',
  EscrowPayment = 'EscrowPayment',
  ConsultationPayment = 'ConsultationPayment'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export interface ClientPaymentStatistics {
  totalPayments: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
  failedAmount: number;
  refundedAmount: number;
  currentBalance: number;
  totalWithdrawals: number;
  withdrawalAmount: number;
  successRate: number;
}

export interface ClientBalance {
  availableBalance: number;
  pendingBalance: number;
  totalBalance: number;
  currency: string;
}

export interface WithdrawalRequest {
  id: number;
  amount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  bankAccount?: string;
  paymentMethod: string;
  fees: number;
  netAmount: number;
}

export enum WithdrawalStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled'
} 