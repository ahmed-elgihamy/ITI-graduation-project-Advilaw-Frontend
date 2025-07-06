export interface ProposalDetailsDTO {
  id: number;
  content: string;
  budget: number;
  status: ProposalStatus;

  jobId: number;
  jobHeader: string;
  jobDescription: string;
  jobBudget: number;

  lawyerId: number;
  lawyerName: string;
}

export enum ProposalStatus {
  None = 0,
  Accepted = 1,
  Rejected = 2,
}
