export interface User {
  username: string;
  email: string;
  bio: string;
  image: string;
  token: string;
  isActive: boolean;
  refreshToken: string;
  cartSlug: string;
}
