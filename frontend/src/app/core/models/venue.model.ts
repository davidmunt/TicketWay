export interface Venue {
  slug: string;
  venue_id: string;
  name: string;
  description: string;
  direction: string;
  city: string;
  country: string;
  capacity: number;
  isActive: boolean;
  status: string;
  images: string[];
}
