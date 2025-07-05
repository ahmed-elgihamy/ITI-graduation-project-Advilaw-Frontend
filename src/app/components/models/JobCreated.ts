import { JobType } from '../../../app/types/Jobs/JobType';

export interface JobCreated {
  id?: number;
  header: string;
  description: string;
  budget: number;
  type: JobType;
  isAnonymus: boolean;
  jobFieldId: number;
  lawyerId?: number;
}