export interface Review {
  id: number;
  text: string;
  rate: number;
  reviewerName: string;      // <-- match backend
  reviewerPhotoUrl: string;  // <-- match backend
  createdAt: string;         // <-- match backend
}
