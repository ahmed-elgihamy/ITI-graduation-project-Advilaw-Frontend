import { SubscriptionPointDTO } from '../SubscriptionPoint/SubscriptionPointDTO';

export interface PlatformSubscriptionDTO {
  id: number;
  name: string;
  price: number;
  points: number;
  isActive: boolean;
  Details: SubscriptionPointDTO[];
}
