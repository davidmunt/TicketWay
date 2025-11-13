export interface Concert {
  slug?: string;
  concert_id: string;
  name: string;
  date: string;
  venue: string;
  description: string;
  category: string;
  artist: string;
  images: string[];
  price: number;
  favorited: boolean;
  availableSeats: number;
  status: string;
  isActive: boolean;
  favoritesCount: number;
}

export interface ProfileConcert {
  slug: string;
  name: string;
  date: string;
  images: string[];
  price: number;
  favorited: boolean;
  favoritesCount: number;
}
