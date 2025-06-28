export interface LawyerPaymentListDTO {
  id: number;
  type: PaymentType;
  amount: number;
  senderId?: string;
  senderName: string;
  senderImgUrl: string;
  createdAt: string; // or Date if you're parsing it into Date objects
}

export enum PaymentType {
  SessionPayment = 0,
  RefundPayment,
  SubscriptionPayment,
  WithdrawPayment,
}
