export interface JobListDTO {
  id?: number;
  header?: string;
  description?: string;
  budget?: number;
  isAnonymus?: boolean;
  clientId?: number;
  clientName?: string;
  clientImageUrl?: string;
  jobFieldId?: number;
  jobFieldName?: string;
  status?: string;
  type?: number; // 1 = ClientPublishing, 2 = LawyerProposal
  duration?: number;
  appointmentTime?: string;
}
