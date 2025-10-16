export interface Concert {
  slug?: string;
  concert_id: number;
  name: string;
  date: string;
  venue: string;
  description: string;
  category: string;
  artist: string;
  images: string[];
}
