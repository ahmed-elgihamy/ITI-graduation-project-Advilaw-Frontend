export interface Client {
  id: number;
  userName: string;
  email: string;
  imageUrl?: string;
  nationalIDImagePath: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  nationalityId?: string;
  gender?: string;
  profilePictureUrl?: string;
  // Add other fields as needed
} 