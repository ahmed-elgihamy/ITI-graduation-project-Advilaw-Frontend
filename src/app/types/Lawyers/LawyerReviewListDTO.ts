export interface LawyerReviewListDTO {
  id: number;
  text: string;
  rate: number;
  type: ReviewType; // or string if you're not using enums
  otherPersonId: string;
  otherPersonName: string;
  otherPersonPhotoUrl: string;
  createdAt: string; // or Date if you parse it
}

export enum ReviewType {
  ClientToLawyer = 'ClientToLawyer',
  LawyerToClient = 'LawyerToClient',
}
