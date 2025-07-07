import { AppointmentStatus } from './AppointmentStatus';
import { AppointmentType } from './AppointmentType';

export interface AppointmentDetailsDTO {
  id: number;
  date: string;
  type: AppointmentType;
  status: AppointmentStatus;
  jobId: number;
  scheduleId?: number;
  
  // Extra for UI:
  jobHeader: string;
  clientName: string;
  lawyerName: string;
}
