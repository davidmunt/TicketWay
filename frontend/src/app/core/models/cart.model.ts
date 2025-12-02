import { ConcertCart } from "./concertCart.model";

export interface Cart {
  slug: string;
  owner: string;
  concerts: ConcertCart[];
  isActive: boolean;
  status: string;
}
