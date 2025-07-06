export interface JobCreate {
  header: string;
  description: string;
  budget: number;
  type: number;
  isAnonymus: boolean;
  jobFieldId: number;
  lawyerId?: number;
  appointmentTime?: string;  
  durationHours?: number;
}
