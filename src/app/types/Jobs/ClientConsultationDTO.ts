export interface ClientConsultationDTO {
  id: number;
  header: string;
  description: string;
  budget: number;
  statusLabel: string;
  lawyerName: string;
  lawyerProfilePictureUrl: string;
  duration?: number | null;
  appointmentTime?: string | null;
} 