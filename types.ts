import { IconType } from 'react-icons';

export interface Category {
  id: string;
  name: string;
  icon: IconType;
}

export interface Supplier {
  name: string;
  logo: string;
}

export interface PaymentMethod {
  name: string;
  icon: IconType;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  badge?: string;
  isNew?: boolean;
  stock: number;
  specs: Record<string, string>;
}

export interface FeaturedService {
  title: string;
  desc: string;
  icon: IconType;
}
