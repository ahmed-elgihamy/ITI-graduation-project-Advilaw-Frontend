export interface JobListDTO {
  Id: number;
  Header: string;
  Description: string;
  budget: number;
  IsAnonymus: boolean;
  ClientId: number;
  ClientName: string;
  ClientImageUrl: string;
  JobFieldId: number;
  JobFieldName: string;
}
