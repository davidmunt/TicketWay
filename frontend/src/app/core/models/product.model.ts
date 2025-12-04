export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCategory: string;
  price: number;
  stockTotal: number;
  stockAvailable: number;
  imageUrl: string;
  status: string;
  isActive: boolean;
}
