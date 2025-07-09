export interface ChatDTO {
  id: number;
  jobId: number;
  jobTitle: string;
  lawyerId: number;
  lawyerName: string;
  lawyerImageUrl: string;
  clientId: number;
  clientName: string;
  clientImageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: ChatStatus;
  statusCode:number;
  createdAt: string;
  updatedAt: string;
}

export enum ChatStatus {
  Active = 'Active',
  Completed = 'Completed',
  Pending = 'Pending'
} 