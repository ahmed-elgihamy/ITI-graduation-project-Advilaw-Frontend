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

  // Navigation Properties
  jobFieldId: number;
  jobFieldName: string;
  lawyerId?: number | null;
  clientId: number;
  clientName: string;
  clientProfilePictureUrl: string;
  escrowTransactionId?: number | null;
  sessionId?: number | null;
}
