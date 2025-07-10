import { AppointmentDetailsDTO } from '../Appointments/AppointmentDetailsDTO';
import { ProposalDetailsDTO } from '../Proposals/ProposalDetailsDTO';
import { JobStatus } from './JobStatus';
import { JobType } from './JobType';

export interface JobDetailsForLawyerDTO {
  id: number;
  header: string;
  description: string;
  budget: number;
  status: JobStatus;
  type: JobType;
  isAnonymus: boolean;
  proposals: ProposalDetailsDTO[];
  appointments: AppointmentDetailsDTO[];

  // Navigation Properties
  jobFieldId: number;
  jobFieldName: string;
  lawyerId?: number | null;
  lawyerName: string;
  clientId: number;
  clientName: string;
  clientProfilePictureUrl: string;
  escrowTransactionId?: number | null;
  sessionId?: number | null;
}
