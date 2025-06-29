export enum UserRole {
  Client = 0,
  Lawyer = 1,
  Admin = 2,
  // Add others as needed
}

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2,
  // Add others as needed
}

export interface LawyerListDTO {
  id: number;
  userName: string;
  city: string;
  country: string;
  imageUrl: string;
  role: UserRole;
  gender: Gender;
}
