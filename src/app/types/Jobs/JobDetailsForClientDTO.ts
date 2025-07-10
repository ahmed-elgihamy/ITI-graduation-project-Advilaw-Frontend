export interface JobDetailsForClientDTO {
  id: number;
  header: string;
  budget: number;
  status: string;
  statusLabel?: string;
  lawyerName?: string;
  appointments?: { appointmentTime: string }[];
  duration?: number;
} 