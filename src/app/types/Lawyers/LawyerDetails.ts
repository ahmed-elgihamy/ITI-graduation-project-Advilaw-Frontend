import { Gender } from './LawyerListDTO';

export interface LawyerDetails {
  bio: string;
  city: string;
  country: string;
  countryCode: string;
  gender: Gender;
  hourlyRate: number;
  NationalityId: number;
  userName: string;
  postalCode: string;
  profileHeader: string;
  profileAbout: string;
  nationalityId: number,
  barAssociationCardNumber: string;
  userId: string;
  imageUrl: string;
  experience: number;
}
